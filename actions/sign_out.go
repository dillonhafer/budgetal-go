package actions

import (
	"net/http"
	"time"

	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

// SignOut default implementation.
func SignOut(c buffalo.Context, currentUser *models.User) error {
	DeleteAuthenticationCookie(c.Response())
	tx := c.Value("tx").(*pop.Connection)
	query := currentUser.CurrentSession.Delete(tx)
	c.Logger().Debug(query)
	return c.Render(200, r.JSON(map[string]string{"signOut": "sign out"}))
}

func DeleteAuthenticationCookie(res http.ResponseWriter) {
	cookie := &http.Cookie{
		Expires: time.Now(),
		Name:    "_budgetal_session",
	}
	http.SetCookie(res, cookie)
}
