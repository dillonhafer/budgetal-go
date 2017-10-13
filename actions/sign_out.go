package actions

import (
	"net/http"
	"time"

	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo"
)

// SignOut default implementation.
func SignOut(c buffalo.Context, currentUser *models.User) error {
	DeleteAuthenticationCookie(c.Response())
	return c.Render(200, r.JSON(map[string]string{"signOut": "sign out"}))
}

func DeleteAuthenticationCookie(res http.ResponseWriter) {
	cookie := &http.Cookie{
		Expires: time.Now(),
		Name:    "_budgetal_session",
	}
	http.SetCookie(res, cookie)
}
