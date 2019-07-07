package mailers

import (
	"fmt"
	"strings"
	"testing"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/nulls"
)

func TestEmailNoticeRender(t *testing.T) {
	host := "https://example.com"
	userEmail := "email@example.com"
	firstName := nulls.String{String: "Kevin", Valid: true}
	user := models.User{FirstName: firstName, Email: userEmail}
	email, err := buildPasswordChangedNotice(&user, host)

	if err != nil {
		t.Errorf("Could not build email: %v", err)
	}

	if len(email.Bodies) != 2 {
		t.Errorf("Email did not have enough types, found %d", len(email.Bodies))
	}

	// HTML assertions
	htmlEmail := email.Bodies[0].Content
	greeting := fmt.Sprintf("<p>Hello %s!</p>", userEmail)
	appHost := fmt.Sprintf("<a href=\"%s\">", host)
	if !strings.Contains(htmlEmail, greeting) {
		t.Errorf("Could not find first name '%s' in html email: %v", greeting, htmlEmail)
	}
	if !strings.Contains(htmlEmail, appHost) {
		t.Errorf("Could not find token '%s' in html email: %v", appHost, htmlEmail)
	}
}
