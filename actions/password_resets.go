package actions

import (
	"time"

	"github.com/dillonhafer/budgetal-go/mailers"
	"github.com/dillonhafer/budgetal-go/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
	"github.com/markbates/pop/nulls"
)

func PasswordResetRequest(c buffalo.Context) error {
	tx := c.Value("tx").(*pop.Connection)
	email, _ := Json(c, "email").(string)
	user := &models.User{}
	err := tx.Where("email = ?", email).First(user)

	if err == nil {
		token := RandomHex(32)
		user.PasswordResetToken = nulls.String{String: token, Valid: true}
		user.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: true}
		err = tx.Update(user)
		if err == nil {
			err = mailers.SendPasswordResets(user)
			if err == nil {
				c.Logger().Debug(err)
			}
		}
	}

	return c.Render(200, r.JSON(""))
}

func ResetPassword(c buffalo.Context) error {
	token, _ := Json(c, "reset_password_token").(string)
	password, _ := Json(c, "password").(string)

	user := &models.User{}
	tx := c.Value("tx").(*pop.Connection)
	query := `
    password_reset_token = ? and
    password_reset_sent_at between
    (now() - interval '2 hours') and now()
  `
	err := tx.Where(query, token).First(user)
	if err != nil {
		return c.Render(401, r.JSON(""))
	}

	user.EncryptPassword([]byte(password))
	user.PasswordResetToken = nulls.String{String: "", Valid: false}
	user.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: false}
	tx.Update(user)

	return c.Render(200, r.JSON(""))
}
