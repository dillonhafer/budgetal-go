package actions

import (
	"fmt"
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
	// Create User
	user := models.User{Email: "user@example.com", Admin: admin}
	user.EncryptPassword([]byte("password"))
	as.DB.Create(&user)

	// Create Session
	session := &models.Session{
		UserAgent:           "TEST",
		AuthenticationToken: RandomHex(16),
		UserID:              user.ID,
		IpAddress:           "127.0.0.1",
	}
	session.Create(as.DB)

	// Sign In User
	cookie := fmt.Sprintf("_budgetal_session=%s; Expires=Tue, 09 Nov 2027 00:17:27 GMT; HttpOnly", session.AuthenticationKey)
	as.Willie.Headers["X-Budgetal-Session"] = session.AuthenticationToken
	as.Willie.Cookies = cookie

	return user
}
