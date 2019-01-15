package mailers

import (
	"fmt"
	"strings"
	"testing"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func Test_TestEmailRender(t *testing.T) {
	firstName := "Kevin"
	user := models.User{FirstName: firstName}
	email, err := BuildTestEmail(&user)

	if err != nil {
		t.Errorf("Could not build email: %v", err)
	}

	if len(email.Bodies) != 2 {
		t.Errorf("Email did not have enough types, found %d", len(email.Bodies))
	}

	// HTML assertions
	htmlEmail := email.Bodies[0].Content
	htmlName := fmt.Sprintf("<p>Hello %s!</p>", firstName)
	if !strings.Contains(htmlEmail, htmlName) {
		t.Errorf("Could not find first name '%s' in html email: %v", htmlName, htmlEmail)
	}
}

func Test_TestEmailRendersTextEmail(t *testing.T) {
	firstName := "Kevin"
	user := models.User{FirstName: firstName}
	email, _ := BuildTestEmail(&user)

	textEmail := email.Bodies[1].Content
	textName := fmt.Sprintf("Hello %s!", firstName)
	if !strings.Contains(textEmail, textName) {
		t.Errorf("Could not find first name '%s' in text email: %v", textName, textEmail)
	}
}
