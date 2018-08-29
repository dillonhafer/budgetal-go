package models_test

import (
	"testing"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/suite"
)

type ModelSuite struct {
	*suite.Model
}

func Test_ModelSuite(t *testing.T) {
	as := &ModelSuite{suite.NewModel()}
	suite.Run(t, as)
}

func (ms *ModelSuite) CreateUser(admin bool) models.User {
	user := models.User{Email: "user@example.com", Admin: admin}
	user.EncryptPassword([]byte("password"))
	ms.DB.Create(&user)
	return user
}
