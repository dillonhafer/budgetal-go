package actions

import (
	"net/http"
	"time"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo"
)

// SignOut default implementation.
func SignOut(c buffalo.Context, currentUser *models.User) error {
	DeleteAuthenticationCookie(c.Response())
	query := currentUser.CurrentSession.Delete()
	c.Logger().Debug(query)
	return c.Render(200, r.JSON(map[string]string{"signOut": "sign out"}))
}

func DeleteAuthenticationCookie(res http.ResponseWriter) {
	cookie := &http.Cookie{
		Expires: time.Now(),
		Name:    AUTH_COOKIE_KEY,
	}
	http.SetCookie(res, cookie)
}
