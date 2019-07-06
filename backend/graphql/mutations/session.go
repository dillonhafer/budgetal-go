package mutations

import (
	"net/http"
	"time"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/gobuffalo/envy"
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

func deleteAuthenticationCookie(res http.ResponseWriter) {
	cookie := &http.Cookie{
		Expires: time.Now(),
		Name:    AUTH_COOKIE_KEY,
	}
	http.SetCookie(res, cookie)
}
