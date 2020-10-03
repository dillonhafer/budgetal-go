package mutations

import (
	"errors"
	"time"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/graphql/resolvers"
	"github.com/dillonhafer/budgetal/backend/mailers"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/nulls"
	"github.com/gofrs/uuid"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

type userInput struct {
	Email           string `mapstructure:"email"`
	FirstName       string `mapstructure:"firstName"`
	LastName        string `mapstructure:"lastName"`
	CurrentPassword string `mapstructure:"password"`
}

// UserUpdate will update the current user
func UserUpdate(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	file, fileOK := context.FileUpload(params.Context)
	if fileOK {
		defer file.Close()
	}

	input := userInput{}
	err := mapstructure.Decode(params.Args["userInput"], &input)
	if err != nil {
		return nil, nil
	}

	if !currentUser.VerifyPassword(input.CurrentPassword) {
		return nil, nil
	}

	// Update Attributes
	currentUser.FirstName = nulls.String{String: input.FirstName, Valid: len(input.FirstName) > 0}
	currentUser.LastName = nulls.String{String: input.LastName, Valid: len(input.LastName) > 0}
	currentUser.Email = input.Email

	// Update Avatar
	if fileOK {
		err = currentUser.SaveAvatar(file)
		if err != nil {
			return nil, nil
		}
	}

	dbErr := models.DB.Update(currentUser)
	if dbErr != nil {
		return nil, nil
	}

	return resolvers.SerializeUser(currentUser), nil
}

// UserChangePassword will update the current user's password
func UserChangePassword(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	password, isOK := params.Args["password"].(string)
	if !isOK {
		return nil, errors.New("New password missing")
	}

	currentPassword, isOK := params.Args["currentPassword"].(string)
	if !isOK {
		return nil, errors.New("Current password missing")
	}

	if !currentUser.VerifyPassword(currentPassword) {
		return nil, errors.New("Current password is incorrect")
	}

	currentUser.EncryptPassword([]byte(password))
	models.DB.Update(currentUser)

	// send email
	mailers.SendPasswordChangedNotice(currentUser)
	return resolvers.SerializeUser(currentUser), nil
}

// RequestPasswordReset tries to send a password reset email
func RequestPasswordReset(params graphql.ResolveParams) (interface{}, error) {
	email, isOK := params.Args["email"].(string)
	if !isOK {
		return nil, errors.New("Email is missing")
	}

	user := &models.User{}
	err := models.DB.Where("email = ?", email).First(user)
	if err == nil {
		mailers.SendPasswordResetInstructions(user)
	}

	return map[string]string{"message": "We sent you an email with instructions on resetting your password"}, nil
}

// ResetPassword resets a user's password
func ResetPassword(params graphql.ResolveParams) (interface{}, error) {
	password, isOK := params.Args["password"].(string)
	if !isOK {
		return nil, errors.New("Password is missing")
	}
	token, isOK := params.Args["token"].(string)
	if !isOK {
		return nil, errors.New("Token is missing")
	}

	user, err := models.FindUserForPasswordReset(token)
	if err != nil {
		return map[string]string{"message": "The link in your email may have expired."}, nil
	}

	user.EncryptPassword([]byte(password))
	user.PasswordResetToken = nulls.String{String: "", Valid: false}
	user.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: false}
	models.DB.Update(user)
	mailers.SendPasswordChangedNotice(user)

	return map[string]string{"message": ""}, nil
}

// Register will sign up a new user
func Register(params graphql.ResolveParams) (interface{}, error) {
	buffalo := context.BuffaloContext(params.Context)

	err := map[string]string{"error": "Incorrect Email or Password"}
	email, isOK := params.Args["email"].(string)
	if !isOK {
		return err, nil
	}
	password, isOK := params.Args["password"].(string)
	if !isOK {
		return err, nil
	}

	user := &models.User{Email: email}
	user.EncryptPassword([]byte(password))
	dbErr := models.DB.Create(user)
	if dbErr != nil {
		err = map[string]string{"error": "Email has already been taken"}
		return err, nil
	}

	ipAddress := buffalo.Request().Header.Get("X-Real-IP")
	if ipAddress == "" {
		ipAddress = buffalo.Request().RemoteAddr
	}

	deviceName, isOK := params.Args["deviceName"].(string)
	if !isOK {
		deviceName = ""
	}
	device := nulls.String{String: deviceName, Valid: len(deviceName) > 0}

	token, uuidErr := uuid.NewV4()
	if uuidErr != nil {
		return nil, errors.New("Unable to generate authentication token")
	}

	session := &models.Session{
		UserAgent:           buffalo.Request().UserAgent(),
		AuthenticationToken: token.String(),
		UserID:              user.ID,
		IpAddress:           ipAddress,
		DeviceName:          device,
	}
	query, _ := session.Create()
	buffalo.Logger().Debug(query)

	// 4. set cookie
	setAuthenticationCookie(buffalo.Response(), session.AuthenticationKey.String())

	// 5. send token
	var response struct {
		AuthenticationToken string                   `json:"authenticationToken"`
		User                resolvers.SerializedUser `json:"user"`
	}
	response.AuthenticationToken = session.AuthenticationToken
	response.User = resolvers.SerializeUser(user)

	return response, nil
}
