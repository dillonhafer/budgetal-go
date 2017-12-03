package mailers

import (
	"fmt"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo/mail"
	"github.com/pkg/errors"
)

func BuildPasswordResetEmail(user *models.User) (mail.Message, error) {
	to := user.Email
	if user.FirstName != "" {
		to = user.FirstName + " <" + user.Email + ">"
	}
	m := mail.NewMessage()
	m.Subject = "Password Reset Instructions"
	m.From = "Budgetal <no-reply@budgetal.com>"
	m.To = []string{to}

	data := map[string]interface{}{
		"name":  user.FirstName,
		"token": user.PasswordResetToken.String,
	}

	err := m.AddBodies(data, r.HTML("password_resets.html"), r.Plain("password_resets.txt"))
	if err != nil {
		return mail.NewMessage(), errors.WithStack(err)
	}

	return m, err
}

func SendPasswordResets(user *models.User) error {
	m, err := BuildPasswordResetEmail(user)
	if err != nil {
		return errors.WithStack(err)
	}

	println(fmt.Sprintf("%#v", m))
	return smtp.Send(m)
}
