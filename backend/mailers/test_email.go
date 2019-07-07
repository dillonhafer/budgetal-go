package mailers

import (
	"fmt"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo/mail"
	"github.com/pkg/errors"
)

func buildTestEmail(user *models.User) (mail.Message, error) {
	to := user.Email
	if user.FirstName.Valid {
		to = user.FirstName.String + " <" + user.Email + ">"
	}
	m := mail.NewMessage()
	m.Subject = "Test Email"
	m.From = "Budgetal <no-reply@budgetal.com>"
	m.To = []string{to}

	data := map[string]interface{}{
		"name": user.FirstName,
	}

	err := m.AddBodies(data, r.HTML("test_email.html"), r.Plain("test_email.txt"))
	if err != nil {
		return mail.NewMessage(), errors.WithStack(err)
	}

	return m, err
}

// SendTestEmail sends an email
func SendTestEmail(user *models.User) error {
	m, err := buildTestEmail(user)
	if err != nil {
		return errors.WithStack(err)
	}

	println(fmt.Sprintf("%#v", m))
	return smtp.Send(m)
}
