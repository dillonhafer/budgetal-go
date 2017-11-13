package actions

import (
	"encoding/json"
	"fmt"

	"github.com/dillonhafer/budgetal-go/models"
)

func (as *ActionSuite) Test_Sessions_Index() {
	SignedInUser(as)

	var expectedResponse struct {
		Sessions map[string][]models.Session
	}

	r := as.JSON("/sessions").Get()
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(1, len(expectedResponse.Sessions["active"]))
}

func (as *ActionSuite) Test_Sessions_Index_RequiresUser() {
	r := as.JSON("/sessions").Get()
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Sessions_Delete() {
	user := as.SignedInUser()
	session := as.CreateSession(user.ID)

	r := as.JSON(fmt.Sprintf("/sessions/%s", session.AuthenticationKey)).Delete()
	as.Equal(200, r.Code)
}

func (as *ActionSuite) Test_Sessions_Delete_RequiresUser() {
	r := as.JSON("/sessions/authKey").Delete()
	as.Equal(401, r.Code)
}
