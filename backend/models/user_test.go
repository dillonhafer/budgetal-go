package models_test

import (
	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/markbates/pop/nulls"
)

func (as *ModelSuite) Test_User_Json() {
	u := &models.User{
		ID:             1,
		FirstName:      "Liz",
		LastName:       "Lemon",
		Email:          "email@example.com",
		AvatarFileName: nulls.String{"abc.jpg", true},
		Admin:          false,
	}
	b, _ := u.MarshalJSON()
	user := string(b)

	as.Contains(user, `"firstName":"Liz"`)
	as.Contains(user, `"lastName":"Lemon"`)
	as.Contains(user, `"email":"email@example.com"`)
	as.Contains(user, `"admin":false`)
	as.Contains(user, `"avatarUrl":"/users/avatars/1/abc.jpg"`)
}

func (as *ModelSuite) Test_User_AvatarUrl() {
	user := &models.User{
		ID:             1,
		AvatarFileName: nulls.String{"abc.jpg", true},
	}
	as.Equal("/users/avatars/1/abc.jpg", user.AvatarUrl())
}

func (as *ModelSuite) Test_User_MissingAvatarUrl() {
	user := &models.User{
		ID: 1,
	}
	as.Equal("/missing-profile.png", user.AvatarUrl())
}
