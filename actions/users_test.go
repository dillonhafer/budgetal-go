package actions

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/dillonhafer/budgetal-go/models"
)

func (as *ActionSuite) Test_Users_Update_RequiresUser() {
	r := as.JSON("/update-user").Patch(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Users_Update() {
	as.SignedInUser()

	params := map[string]string{
		"firstName": "Liz",
		"lastName":  "Lemon",
		"email":     "liz.lemon@example.com",
		"password":  "password",
	}

	var updateUserParams []string
	for key, val := range params {
		updateUserParams = append(updateUserParams, fmt.Sprintf("%s=%s", key, val))
	}

	// File upload
	body := &bytes.Buffer{}
	// writer := multipart.NewWriter(body)
	// part, err := writer.CreateFormFile(paramName, filepath.Base(path))
	// if err != nil {
	// 	return nil, err
	// }
	// _, err = io.Copy(part, file)
	// writer.Close()

	var expectedResponse struct {
		User models.User `json:"user"`
	}
	url := fmt.Sprintf("/update-user?%s", strings.Join(updateUserParams, "&"))
	r := as.HTML(url).MultiPartPut(body)

	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(200, r.Code)
	as.Equal("Liz", expectedResponse.User.FirstName)
	as.Equal("Lemon", expectedResponse.User.LastName)
	as.Equal("liz.lemon@example.com", expectedResponse.User.Email)
}

func (as *ActionSuite) Test_Users_Update_CurrentPasswordDoesNotMatch() {
	as.SignedInUser()

	updateUserParams := map[string]string{
		"firstName": "Liz",
		"lastName":  "Lemon",
		"email":     "liz.lemon@example.com",
		"password":  "not my password",
	}
	var expectedResponse struct {
		Error string `json:"error"`
	}
	r := as.JSON("/update-user").Patch(updateUserParams)
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(401, r.Code)
	as.Equal("Incorrect Password", expectedResponse.Error)
}

func (as *ActionSuite) Test_Users_ChangePassword_RequiresUser() {
	r := as.JSON("/update-password").Patch(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Users_ChangePassword_CurrentPasswordDoesNotMatch() {
	as.SignedInUser()

	updatePasswordParams := map[string]string{
		"currentPassword": "not my password",
		"password":        "newpassword",
	}

	var expectedResponse struct {
		Error string `json:"error"`
	}
	r := as.JSON("/update-password").Patch(updatePasswordParams)
	json.NewDecoder(r.Body).Decode(&expectedResponse)
	as.Equal(401, r.Code)
	as.Equal("Incorrect Password", expectedResponse.Error)
}

func (as *ActionSuite) Test_Users_ChangePassword() {
	as.SignedInUser()

	var expectedResponse struct {
		Message string `json:"message"`
	}
	updatePasswordParams := map[string]string{
		"currentPassword": "password",
		"password":        "newpassword",
	}

	r := as.JSON("/update-password").Patch(updatePasswordParams)
	json.NewDecoder(r.Body).Decode(&expectedResponse)

	as.Equal(200, r.Code)
	as.Equal("Password Successfully Changed", expectedResponse.Message)
}
