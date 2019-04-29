package actions

import (
	"time"

	"github.com/dillonhafer/budgetal/backend/mailers"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/nulls"
)

func PasswordResetRequest(c buffalo.Context) error {
	var params struct {
		Email string `json:"email"`
	}
	if err := c.Bind(&params); err != nil {
		return err
	}

	user := &models.User{}
	err := models.DB.Where("email = ?", params.Email).First(user)

	if err == nil {
		token := RandomHex(32)
		user.PasswordResetToken = nulls.String{String: token, Valid: true}
		user.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: true}
		err = models.DB.Update(user)
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
	var params struct {
		Token    string `json:"reset_password_token"`
		Password string `json:"password"`
	}
	if err := c.Bind(&params); err != nil {
		return err
	}

	user := &models.User{}
	query := `
    password_reset_token = ? and
    password_reset_sent_at between
    (now() - interval '2 hours') and now()
  `
	err := models.DB.Where(query, params.Token).First(user)
	if err != nil {
		errMsg := map[string]string{"error": "The link in your email may have expired."}
		return c.Render(422, r.JSON(errMsg))
	}

	user.EncryptPassword([]byte(params.Password))
	user.PasswordResetToken = nulls.String{String: "", Valid: false}
	user.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: false}
	models.DB.Update(user)

	return c.Render(200, r.JSON(""))
}
