package actions

import (
	"time"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/pop/nulls"
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
	as.Equal(422, r.Code)
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
