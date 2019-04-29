package actions

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal/backend/models"
)

func createUser(as *ActionSuite, email, password string) *models.User {
	user := models.NewUser(email, password)
	as.DB.Create(&user)
	return &user
}

func (as *ActionSuite) Test_SignIn_SignIn() {
	createUser(as, "user@example.com", "password")

	var expectedResponse struct {
		Token string      `json:"token"`
		User  models.User `json:"user"`
	}

	credentials := map[string]string{"email": "user@example.com", "password": "password"}
	r := as.JSON("/sign-in").Post(credentials)
	json.NewDecoder(r.Body).Decode(&expectedResponse)

	as.Equal(r.Code, 200)
	as.Equal(32, len(expectedResponse.Token))
	as.Equal("user@example.com", expectedResponse.User.Email)
}

func (as *ActionSuite) Test_SignIn_WrongPassword() {
	createUser(as, "user@example.com", "password")

	var expectedResponse struct {
		Error string `json:"error"`
	}

	credentials := map[string]string{"email": "user@example.com", "password": "bad-password"}
	r := as.JSON("/sign-in").Post(credentials)
	json.NewDecoder(r.Body).Decode(&expectedResponse)

	as.Equal(r.Code, 422)
	as.Equal("Incorrect Email or Password", expectedResponse.Error)
}

func (as *ActionSuite) Test_SignIn_WrongEmail() {
	createUser(as, "user@example.com", "password")

	var expectedResponse struct {
		Error string `json:"error"`
	}

	credentials := map[string]string{"email": "not-email@example.com", "password": "password"}
	r := as.JSON("/sign-in").Post(credentials)
	json.NewDecoder(r.Body).Decode(&expectedResponse)

	as.Equal(r.Code, 422)
	as.Equal("Incorrect Email or Password", expectedResponse.Error)
}

func (as *ActionSuite) Test_SignIn_EmptyEmail() {
	createUser(as, "user@example.com", "password")

	var expectedResponse struct {
		Error string `json:"error"`
	}

	credentials := map[string]string{"email": "", "password": "password"}
	r := as.JSON("/sign-in").Post(credentials)
	json.NewDecoder(r.Body).Decode(&expectedResponse)

	as.Equal(r.Code, 422)
	as.Equal("Incorrect Email or Password", expectedResponse.Error)
}
