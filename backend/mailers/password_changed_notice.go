package mailers

import (
	"fmt"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo/mail"
	"github.com/gobuffalo/envy"
	"github.com/pkg/errors"
)

func buildPasswordChangedNotice(user *models.User, host string) (mail.Message, error) {
	to := user.Email
	if user.FirstName.Valid {
		to = user.FirstName.String + " <" + user.Email + ">"
	}

	m := mail.NewMessage()
	m.Subject = "Password Changed"
	m.From = "Budgetal <no-reply@budgetal.com>"
	m.To = []string{to}

	data := map[string]interface{}{
		"email": user.Email,
		"host":  host,
	}

	err := m.AddBodies(data, r.HTML("password_changed_notice.html"), r.Plain("password_changed_notice.txt"))
	if err != nil {
		return mail.NewMessage(), errors.WithStack(err)
	}

	return m, err
}

// SendPasswordChangedNotice sends an email
func SendPasswordChangedNotice(user *models.User) error {
	host := envy.Get("APP_HOST", "http://localhost:3001")
	m, err := buildPasswordChangedNotice(user, host)
	if err != nil {
		return errors.WithStack(err)
	}

	println(fmt.Sprintf("%#v", m))
	return smtp.Send(m)
}
