package mailers

import (
	"fmt"

	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo/render"
	"github.com/gobuffalo/x/mail"
	"github.com/pkg/errors"
)

func SendPasswordResets(user *models.User) error {
	to := user.Email
	if user.FirstName != "" {
		to = user.FirstName + " <" + user.Email + ">"
	}
	m := mail.NewMessage()
	m.Subject = "Password Reset Instructions"
	m.From = "Budgetal <no-reply@budgetal.com>"
	m.To = []string{to}
	err := m.AddBody(r.HTML("password_resets.html"), render.Data{"name": user.FirstName, "token": user.PasswordResetToken.String})
	if err != nil {
		return errors.WithStack(err)
	}
	println(fmt.Sprintf("%#v", m))
	return smtp.Send(m)
}
