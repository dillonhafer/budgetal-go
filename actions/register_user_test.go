package actions

import (
	"github.com/dillonhafer/budgetal-go/models"
)

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
