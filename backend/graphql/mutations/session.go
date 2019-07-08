package mutations

import (
	"net/http"
	"time"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/envy"
	uuid "github.com/gobuffalo/uuid"
	"github.com/graphql-go/graphql"
)

var AUTH_HEADER_KEY = envy.Get("BUDGETAL_HEADER", "X-Budgetal-Session")
var AUTH_COOKIE_KEY = envy.Get("BUDGETAL_COOKIE", "_budgetal_session")
var COOKIE_DOMAIN = envy.Get("COOKIE_DOMAIN", "api.budgetal.com")

// SignOut will sign out a logged in user
func SignOut(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	buffalo := context.BuffaloContext(params.Context)

	currentUser.CurrentSession.Delete()
	deleteAuthenticationCookie(buffalo.Response())
	return currentUser, nil
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
