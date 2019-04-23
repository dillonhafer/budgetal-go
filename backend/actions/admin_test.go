package actions

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ActionSuite) Test_Admin_UsersNotAuthenticated() {
	user := as.CreateUser()

	var expectedResponse struct {
		Users []models.User
	}

	r := as.AuthenticJSON(user, "/admin/users").Get()
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Admin_TestPushNotification_NotAdmin() {
	user := as.CreateUser()
	r := as.AuthenticJSON(user, "/admin/test-push-notification").Post(map[string]string{"title": "Title", "body": "Body"})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Admin_TestPushNotification_RequiresUser() {
	r := as.JSON("/admin/test-push-notification").Post(map[string]string{"title": "Title", "body": "Body"})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Admin_UsersSeesUsers() {
	user := as.CreateAdminUser()

	var expectedResponse struct {
		Users []models.User
	}

	r := as.AuthenticJSON(user, "/admin/users").Get()
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(200, r.Code)
	as.Equal(1, len(expectedResponse.Users))
}
