package actions

import (
	"github.com/dillonhafer/budgetal-go/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func RegisterUser(c buffalo.Context) error {
	var ok bool
	var params struct {
		Email    string `json:"email"`
		Password []byte `json:"password"`
	}
	var response struct {
		Token string       `json:"token"`
		User  *models.User `json:"user"`
	}
	err := map[string]string{"error": "Invalid email or password"}
	params.Email, ok = Json(c, "email").(string)
	if !ok {
		return c.Render(401, r.JSON(err))
	}

	passwordString, ok := Json(c, "password").(string)
	if !ok {
		return c.Render(401, r.JSON(err))
	}
	params.Password = []byte(passwordString)

	// 1. look up user from email
	//    return error if no user is found
	tx := c.Value("tx").(*pop.Connection)
	user := &models.User{Email: params.Email}
	user.EncryptPassword(params.Password)

	dbErr := tx.Create(user)
	if dbErr != nil {
		return c.Render(401, r.JSON(err))
	}

	// 3. create session
	session := &models.Session{
		UserAgent:           c.Request().UserAgent(),
		AuthenticationToken: RandomHex(16),
		UserID:              user.ID,
		IpAddress:           c.Request().RemoteAddr,
	}
	query := session.Create(tx)
	c.Logger().Debug(query)

	// 4. set cookie
	SetAuthenticationCookie(c.Response(), session.AuthenticationKey)

	// 5. send token
	response.Token = session.AuthenticationToken
	response.User = user
	return c.Render(200, r.JSON(response))
}
