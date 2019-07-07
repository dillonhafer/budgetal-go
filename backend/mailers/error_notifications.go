package mailers

import (
	"fmt"
	"strings"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/mail"
	"github.com/pkg/errors"
)

func buildErrorNotification(emails string, e error, c buffalo.Context) (mail.Message, error) {
	m := mail.NewMessage()
	m.Subject = "[500] Budgetal Error Notification"
	m.From = "Budgetal <no-reply@budgetal.com>"
	m.To = strings.Split(emails, ",")

	data := map[string]interface{}{
		"e":          fmt.Sprintf("%v", e),
		"error":      fmt.Sprintf("%+v", e),
		"requestUrl": fmt.Sprintf("%#v", c.Request().RequestURI),
		"remoteAddr": fmt.Sprintf("%#v", c.Request().Header.Get("X-Real-IP")),
		"userAgent":  fmt.Sprintf("%#v", c.Request().UserAgent()),
		"headers":    strings.Split(fmt.Sprintf("%#v", c.Request().Header), ","),
	}

	err := m.AddBodies(data, r.HTML("error_notification.html"))
	if err != nil {
		return mail.NewMessage(), errors.WithStack(err)
	}

	return m, err
}

// SendErrorNotification sends an email
func SendErrorNotification(emails string, err error, c buffalo.Context) error {
	m, err := buildErrorNotification(emails, err, c)
	if err != nil {
		return errors.WithStack(err)
	}

	println(fmt.Sprintf("%#v", m))
	return smtp.Send(m)
}
