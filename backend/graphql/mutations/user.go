package mutations

import (
	"errors"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/graphql/resolvers"
	"github.com/dillonhafer/budgetal/backend/mailers"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/nulls"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

type userInput struct {
	Email           string `mapstructure:"email"`
	FirstName       string `mapstructure:"firstName"`
	LastName        string `mapstructure:"lastName"`
	CurrentPassword string `mapstructure:"password"`
}

// UserUpdate will update the current user
func UserUpdate(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	file, fileOK := context.FileUpload(params.Context)
	if fileOK {
		defer file.Close()
	}

	input := userInput{}
	err := mapstructure.Decode(params.Args["userInput"], &input)
	if err != nil {
		return nil, nil
	}

	if !currentUser.VerifyPassword(input.CurrentPassword) {
		return nil, nil
	}

	// Update Attributes
	currentUser.FirstName = nulls.String{String: input.FirstName, Valid: len(input.FirstName) > 0}
	currentUser.LastName = nulls.String{String: input.LastName, Valid: len(input.LastName) > 0}
	currentUser.Email = input.Email

	// Update Avatar
	if fileOK {
		err = currentUser.SaveAvatar(file)
		if err != nil {
			return nil, nil
		}
	}

	dbErr := models.DB.Update(currentUser)
	if dbErr != nil {
		return nil, nil
	}

	return resolvers.SerializeUser(currentUser), nil
}

// UserChangePassword will update the current user's password
func UserChangePassword(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	password, isOK := params.Args["password"].(string)
	if !isOK {
		return nil, errors.New("New password missing")
	}

	currentPassword, isOK := params.Args["currentPassword"].(string)
	if !isOK {
		return nil, errors.New("Current password missing")
	}

	if !currentUser.VerifyPassword(currentPassword) {
		return nil, errors.New("Current password is incorrect")
	}

	currentUser.EncryptPassword([]byte(password))
	models.DB.Update(currentUser)

	// send email
	mailers.SendPasswordChangedNotice(currentUser)
	return resolvers.SerializeUser(currentUser), nil
}
