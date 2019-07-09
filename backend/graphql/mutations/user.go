package mutations

import (
	"errors"
	"time"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/graphql/resolvers"
	"github.com/dillonhafer/budgetal/backend/mailers"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/nulls"
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
