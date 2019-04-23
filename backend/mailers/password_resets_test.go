package mailers

import (
	"fmt"
	"strings"
	"testing"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/nulls"
)

func TestEmailRender(t *testing.T) {
	host := "https://example.com"
	token := nulls.String{String: "token", Valid: true}
	firstName := nulls.String{String: "Kevin", Valid: true}
	user := models.User{FirstName: firstName, PasswordResetToken: token}
	email, err := BuildPasswordResetEmail(&user, host)

	if err != nil {
		t.Errorf("Could not build email: %v", err)
	}

	if len(email.Bodies) != 2 {
		t.Errorf("Email did not have enough types, found %d", len(email.Bodies))
	}

	// HTML assertions
	htmlEmail := email.Bodies[0].Content
	htmlName := fmt.Sprintf("<p>Hello %s!</p>", firstName.String)
	htmlToken := fmt.Sprintf("<a href=\"%s/reset-password?reset_password_token=%s\">", host, token.String)
	if !strings.Contains(htmlEmail, htmlName) {
		t.Errorf("Could not find first name '%s' in html email: %v", htmlName, htmlEmail)
	}
	if !strings.Contains(htmlEmail, htmlToken) {
		t.Errorf("Could not find token '%s' in html email: %v", htmlToken, htmlEmail)
	}
}

func TestEmailRendersTextEmail(t *testing.T) {
	host := "https://example.com"
	token := nulls.String{String: "token", Valid: true}
	firstName := nulls.String{String: "Kevin", Valid: true}
	user := models.User{FirstName: firstName, PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user, host)

	textEmail := email.Bodies[1].Content
	textName := fmt.Sprintf("Hello %s!", firstName.String)
	textToken := fmt.Sprintf("%s/reset-password?reset_password_token=%s", host, token.String)
	if !strings.Contains(textEmail, textName) {
		t.Errorf("Could not find first name '%s' in text email: %v", textName, textEmail)
	}
	if !strings.Contains(textEmail, textToken) {
		t.Errorf("Could not find token '%s' in text email: %v", textToken, textEmail)
	}
}

func TestEmailRendersFrom(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	user := models.User{FirstName: nulls.String{String: "", Valid: true}, PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user, "")

	if email.From != "Budgetal <no-reply@budgetal.com>" {
		t.Errorf("From did not match, got: %v", email.From)
	}
}

func TestEmailRendersNameInTo(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	user := models.User{FirstName: nulls.String{String: "Kevin", Valid: true}, Email: "kevin@example.com", PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user, "")

	if email.To[0] != "Kevin <kevin@example.com>" {
		t.Errorf("From did not match, got: %v", email.To)
	}
}

func TestEmailDoesNotRendersNameInTo(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	user := models.User{FirstName: nulls.String{String: "", Valid: false}, Email: "kevin@example.com", PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user, "")

	if email.To[0] != "kevin@example.com" {
		t.Errorf("From did not match, got: %v", email.To)
	}
}
