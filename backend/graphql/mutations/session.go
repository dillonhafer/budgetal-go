package mutations

import (
	"errors"
	"net/http"
	"time"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/graphql/resolvers"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/nulls"
	"github.com/gofrs/uuid"
	"github.com/graphql-go/graphql"
)

var AUTH_HEADER_KEY = envy.Get("BUDGETAL_HEADER", "X-Budgetal-Session")
var AUTH_COOKIE_KEY = envy.Get("BUDGETAL_COOKIE", "_budgetal_session")
var COOKIE_DOMAIN = envy.Get("COOKIE_DOMAIN", "api.budgetal.com")
var ENV = envy.Get("GO_ENV", "development")

// SignOut will sign out a logged in user
func SignOut(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	buffalo := context.BuffaloContext(params.Context)

	currentUser.CurrentSession.Delete()
	deleteAuthenticationCookie(buffalo.Response())
	return currentUser, nil
}

// SignIn will sign in a user
func SignIn(params graphql.ResolveParams) (interface{}, error) {
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

	// 1. look up user from email
	user := &models.User{}
	dbErr := models.DB.Where("email = ?", email).First(user)
	if dbErr != nil {
		return err, nil
	}

	// 2. check if password is valid
	authentic := user.VerifyPassword(password)
	if authentic == false {
		return err, nil
	}

	// 3. create session
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

// SessionDelete will sign out another session
func SessionDelete(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	buffalo := context.BuffaloContext(params.Context)

	paramKey, isOK := params.Args["authenticationKey"].(string)
	if !isOK {
		return nil, nil
	}

	authenticationKey, err := uuid.FromString(paramKey)
	if err != nil {
		return nil, nil
	}

	session := &models.Session{}
	err = models.DB.Where("expired_at is null and user_id = ? and authentication_key = ?", currentUser.ID, authenticationKey).First(session)
	if err != nil {
		return nil, nil
	}

	q := session.Delete()
	buffalo.Logger().Debug(q)

	return session, nil
}

func deleteAuthenticationCookie(res http.ResponseWriter) {
	cookie := &http.Cookie{
		Expires: time.Now(),
		Name:    AUTH_COOKIE_KEY,
	}
	http.SetCookie(res, cookie)
}

func setAuthenticationCookie(res http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Expires:  time.Now().Add(time.Hour * 87600),
		Name:     AUTH_COOKIE_KEY,
		Value:    token,
		Secure:   ENV == "production",
		HttpOnly: true,
	}
	http.SetCookie(res, cookie)
}
