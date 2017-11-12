package mailers

import (
	"fmt"
	"strings"
	"testing"

	"github.com/dillonhafer/budgetal-go/models"
	"github.com/markbates/pop/nulls"
)

func TestEmailRender(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	firstName := "Kevin"
	user := models.User{FirstName: firstName, PasswordResetToken: token}
	email, err := BuildPasswordResetEmail(&user)

	if err != nil {
		t.Errorf("Could not build email: %v", err)
	}

	if len(email.Bodies) != 2 {
		t.Errorf("Email did not have enough types, found %i", len(email.Bodies))
	}

	// HTML assertions
	htmlEmail := email.Bodies[0].Content
	htmlName := fmt.Sprintf("<p>Hello %s!</p>", firstName)
	htmlToken := fmt.Sprintf("<a href=\"https://www.budgetal.com/reset-password?reset_password_token=%s\">", token.String)
	if !strings.Contains(htmlEmail, htmlName) {
		t.Errorf("Could not find first name '%s' in html email: %v", htmlName, htmlEmail)
	}
	if !strings.Contains(htmlEmail, htmlToken) {
		t.Errorf("Could not find token '%s' in html email: %v", htmlToken, htmlEmail)
	}
}

func TestEmailRendersTextEmail(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	firstName := "Kevin"
	user := models.User{FirstName: firstName, PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user)

	textEmail := email.Bodies[1].Content
	textName := fmt.Sprintf("Hello %s!", firstName)
	textToken := fmt.Sprintf("https://www.budgetal.com/reset-password?reset_password_token=%s", token.String)
	if !strings.Contains(textEmail, textName) {
		t.Errorf("Could not find first name '%s' in text email: %v", textName, textEmail)
	}
	if !strings.Contains(textEmail, textToken) {
		t.Errorf("Could not find token '%s' in text email: %v", textToken, textEmail)
	}
}

func TestEmailRendersFrom(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	user := models.User{FirstName: "", PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user)

	if email.From != "Budgetal <no-reply@budgetal.com>" {
		t.Errorf("From did not match, got: %v", email.From)
	}
}

func TestEmailRendersNameInTo(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	user := models.User{FirstName: "Kevin", Email: "kevin@example.com", PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user)

	if email.To[0] != "Kevin <kevin@example.com>" {
		t.Errorf("From did not match, got: %v", email.To)
	}
}

func TestEmailDoesNotRendersNameInTo(t *testing.T) {
	token := nulls.String{String: "token", Valid: true}
	user := models.User{FirstName: "", Email: "kevin@example.com", PasswordResetToken: token}
	email, _ := BuildPasswordResetEmail(&user)

	if email.To[0] != "kevin@example.com" {
		t.Errorf("From did not match, got: %v", email.To)
	}
}
