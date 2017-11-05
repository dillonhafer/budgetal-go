package actions

import (
	"encoding/json"

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
