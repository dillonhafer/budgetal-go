package mailers

import (
	"fmt"
	"time"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/dillonhafer/budgetal/backend/helpers"
	"github.com/gobuffalo/buffalo/mail"
	"github.com/gobuffalo/nulls"
	"github.com/gobuffalo/envy"
	"github.com/pkg/errors"
)

func buildPasswordResetEmail(user *models.User, host string) (mail.Message, error) {
	to := user.Email
	if user.FirstName.Valid {
		to = user.FirstName.String + " <" + user.Email + ">"
	}

	m := mail.NewMessage()
	m.Subject = "Password Reset Instructions"
	m.From = "Budgetal <no-reply@budgetal.com>"
	m.To = []string{to}

	data := map[string]interface{}{
		"name":  user.FirstName.String,
		"token": user.PasswordResetToken.String,
		"host":  host,
	}

	err := m.AddBodies(data, r.HTML("password_resets.html"), r.Plain("password_resets.txt"))
	if err != nil {
		return mail.NewMessage(), errors.WithStack(err)
	}

	return m, err
}

// SendPasswordResets sends an email
func SendPasswordResets(user *models.User) error {
	host := envy.Get("APP_HOST", "http://localhost:3001")
	m, err := buildPasswordResetEmail(user, host)
	if err != nil {
		return errors.WithStack(err)
	}

	println(fmt.Sprintf("%#v", m))
	return smtp.Send(m)
}

// SendPasswordResetInstructions sends emails
func SendPasswordResetInstructions(u *models.User) {
	token := helpers.RandomHex(32)
	u.PasswordResetToken = nulls.String{String: token, Valid: true}
	u.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: true}
	models.DB.Update(u)
	SendPasswordResets(u)
}