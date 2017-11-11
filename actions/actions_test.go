package actions

import (
	"encoding/json"
	"testing"

	"github.com/dillonhafer/budgetal-go/models"
	"github.com/gobuffalo/suite"
)

type ActionSuite struct {
	*suite.Action
}

func Test_ActionSuite(t *testing.T) {
	as := &ActionSuite{suite.NewAction(App())}
	suite.Run(t, as)
}

func SignedInUser(as *ActionSuite) models.User {
	return signInUser(false, as)
}

func SignedInAdminUser(as *ActionSuite) models.User {
	return signInUser(true, as)
}

func signInUser(admin bool, as *ActionSuite) models.User {
	user := &models.User{Email: "user@example.com", Admin: admin}
	user.EncryptPassword([]byte("password"))
	as.DB.Create(user)

	registerBody := map[string]string{
		"email":    "user@example.com",
		"password": "password",
	}
	r := as.JSON("/sign-in").Post(registerBody)
	var jsonBody struct {
		Token string      `json:"token"`
		User  models.User `json:"user"`
	}
	json.NewDecoder(r.Body).Decode(&jsonBody)

	// Sign In User
	as.Willie.Headers["X-Budgetal-Session"] = jsonBody.Token
	as.Willie.Cookies = r.Header().Get("Set-Cookie")
	return jsonBody.User
}
