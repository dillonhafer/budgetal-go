package actions

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/dillonhafer/budgetal-go/models"
	"github.com/markbates/pop/nulls"
)

func (as *ActionSuite) Test_Users_UpdatePassword() {
	user := as.CreateUser(false)
	user.PasswordResetToken = nulls.String{String: "token", Valid: true}
	user.PasswordResetSentAt = nulls.Time{Time: time.Now().Local().Add((-119 * time.Minute)), Valid: true}
	as.DB.Update(&user)
	as.True(user.PasswordResetToken.Valid)
	as.True(user.PasswordResetSentAt.Valid)
	as.False(user.VerifyPassword("new password"))

	updatePasswordParams := map[string]string{
		"password":             "new password",
		"reset_password_token": "token",
	}

	r := as.JSON("/reset-password").Put(updatePasswordParams)
	as.Equal(200, r.Code)
	as.DB.Reload(&user)

	as.False(user.PasswordResetToken.Valid)
	as.False(user.PasswordResetSentAt.Valid)
	as.True(user.VerifyPassword("new password"))
}

func (as *ActionSuite) Test_Users_UpdatePassword_TokenExpired() {
	user := as.CreateUser(false)
	user.PasswordResetToken = nulls.String{String: "token", Valid: true}
	twoHoursAgo := time.Now().Local().Add((-120 * time.Minute))
	user.PasswordResetSentAt = nulls.Time{Time: twoHoursAgo, Valid: true}
	as.DB.Update(&user)
	as.True(user.PasswordResetToken.Valid)
	as.True(user.PasswordResetSentAt.Valid)
	as.False(user.VerifyPassword("new password"))

	updatePasswordParams := map[string]string{
		"password":             "new password",
		"reset_password_token": "token",
	}

	r := as.JSON("/reset-password").Put(updatePasswordParams)
	as.Equal(401, r.Code)
	as.DB.Reload(&user)

	as.True(user.PasswordResetToken.Valid)
	as.True(user.PasswordResetSentAt.Valid)
	as.True(user.VerifyPassword("password"))
	as.False(user.VerifyPassword("new password"))
}

func (as *ActionSuite) Test_Users_PasswordResetRequest() {
	user := as.CreateUser(false)
	as.False(user.PasswordResetToken.Valid)
	as.False(user.PasswordResetSentAt.Valid)

	r := as.JSON("/reset-password").Post(map[string]string{"email": "user@example.com"})
	as.Equal(200, r.Code)
	as.DB.Reload(&user)

	as.True(user.PasswordResetToken.Valid)
	as.True(user.PasswordResetSentAt.Valid)
}

func (as *ActionSuite) Test_Users_PasswordResetRequest_AlwaysWorks() {
	r := as.JSON("/reset-password").Post(map[string]string{"email": "not.a.user@example.com"})
	as.Equal(200, r.Code)
	count, _ := as.DB.Count(&models.Users{})
	as.Equal(0, count)
}

func (as *ActionSuite) Test_Users_Create() {
	count, _ := as.DB.Count(&models.Users{})
	as.Equal(0, count)

	r := as.JSON("/register").Post(map[string]string{
		"email":    "new.user@example.com",
		"password": "password123",
	})
	as.Equal(200, r.Code)

	count, _ = as.DB.Count(&models.Users{})
	as.Equal(1, count)
	user := models.User{}
	as.DB.First(&user)

	as.Equal("new.user@example.com", user.Email)
	as.True(user.VerifyPassword("password123"))
}

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
