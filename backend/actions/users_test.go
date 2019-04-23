package actions

import (
	"encoding/json"
	"os"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/httptest"
)

func (as *ActionSuite) Test_Users_UpdatePushNotificationToken_RequiresUser() {
	r := as.JSON("/update-push-notification-token").Put(map[string]string{"token": "PushNotificationToken"})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Users_UpdatePushNotificationToken() {
	deviceToken := "MyExpPushToken[1234]"
	user := as.CreateUser()
	r := as.AuthenticJSON(user, "/update-push-notification-token").Put(map[string]string{"token": deviceToken})

	sessions := models.Sessions{}
	models.DB.Where("push_notification_token is not null").All(&sessions)

	as.Equal(200, r.Code)
	as.Equal(1, len(sessions))
	as.Equal(user.ID, sessions[0].UserID)
	as.Equal(deviceToken, sessions[0].PushNotificationToken.String)
}

func (as *ActionSuite) Test_Users_Update_RequiresUser() {
	r := as.JSON("/update-user").Patch(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Users_Update() {
	user := as.CreateUser()

	params := struct {
		FirstName string `form:"firstName"`
		LastName  string `form:"lastName"`
		Email     string `form:"email"`
		Password  string `form:"password"`
	}{"Liz", "Lemon", "liz.lemon@example.com", "password"}

	photo, err := os.Open("../../frontend/src/images/app-logo.png")
	as.NoError(err)
	file := httptest.File{ParamName: "avatar", FileName: "myphoto.jpg", Reader: photo}

	r, err := as.Authenticate(user).HTML("/update-user").MultiPartPut(params, file)
	as.NoError(err)

	var expectedResponse struct {
		User models.User `json:"user"`
	}
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(200, r.Code)
	as.Equal("Liz", expectedResponse.User.FirstName.String)
	as.Equal("Lemon", expectedResponse.User.LastName.String)
	as.Equal("liz.lemon@example.com", expectedResponse.User.Email)
}

func (as *ActionSuite) Test_Users_Update_CurrentPasswordDoesNotMatch() {
	user := as.CreateUser()

	updateUserParams := map[string]string{
		"firstName": "Liz",
		"lastName":  "Lemon",
		"email":     "liz.lemon@example.com",
		"password":  "not my password",
	}
	var expectedResponse struct {
		Error string `json:"error"`
	}
	r := as.AuthenticJSON(user, "/update-user").Patch(updateUserParams)
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(422, r.Code)
	as.Equal("Incorrect Password", expectedResponse.Error)
}

func (as *ActionSuite) Test_Users_ChangePassword_RequiresUser() {
	r := as.JSON("/update-password").Patch(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Users_ChangePassword_CurrentPasswordDoesNotMatch() {
	user := as.CreateUser()

	updatePasswordParams := map[string]string{
		"currentPassword": "not my password",
		"password":        "newpassword",
	}

	var expectedResponse struct {
		Error string `json:"error"`
	}
	r := as.AuthenticJSON(user, "/update-password").Patch(updatePasswordParams)
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(422, r.Code)
	as.Equal("Incorrect Password", expectedResponse.Error)
}

func (as *ActionSuite) Test_Users_ChangePassword() {
	user := as.CreateUser()

	var expectedResponse struct {
		Message string `json:"message"`
	}
	updatePasswordParams := map[string]string{
		"currentPassword": "password",
		"password":        "newpassword",
	}

	r := as.AuthenticJSON(user, "/update-password").Patch(updatePasswordParams)
	json.NewDecoder(r.Body).Decode(&expectedResponse)

	as.Equal(200, r.Code)
	as.Equal("Password Successfully Changed", expectedResponse.Message)
}
