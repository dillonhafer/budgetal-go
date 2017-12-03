package actions

import (
	"github.com/dillonhafer/budgetal-go/backend/mailers"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
)

func ErrorNotification(err error, c buffalo.Context) {
	notifyEmails := envy.Get("ERROR_NOTIFICATION_EMAILS", "")
	shouldNotify := notifyEmails != "" && ENV == "production"

	if shouldNotify {
		mailers.SendErrorNotification(notifyEmails, err, c)
	}
}
