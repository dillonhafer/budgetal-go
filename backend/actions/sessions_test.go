package actions

import (
	"encoding/json"
	"fmt"

	"github.com/dillonhafer/budgetal/backend/models"
)

func (as *ActionSuite) Test_Sessions_Index() {
	user := as.CreateUser()

	var expectedResponse struct {
		Sessions map[string][]models.Session
	}

	r := as.AuthenticJSON(user, "/sessions").Get()
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(1, len(expectedResponse.Sessions["active"]))
}

func (as *ActionSuite) Test_Sessions_Index_RequiresUser() {
	r := as.JSON("/sessions").Get()
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Sessions_Delete() {
	user := as.CreateUser()
	session := as.CreateSession(user.ID)

	r := as.AuthenticJSON(user, fmt.Sprintf("/sessions/%s", session.AuthenticationKey)).Delete()
	as.Equal(200, r.Code)
}

func (as *ActionSuite) Test_Sessions_Delete_RequiresUser() {
	r := as.JSON("/sessions/authKey").Delete()
	as.Equal(401, r.Code)
}
