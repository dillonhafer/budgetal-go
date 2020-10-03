package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
	"github.com/gobuffalo/nulls"
)

// SerializedUser is the response for graphql
type SerializedUser struct {
	ID        int     `json:"id"`
	Email     string  `json:"email"`
	FirstName nulls.String `json:"firstName"`
	LastName  nulls.String `json:"lastName"`
	Admin     bool    `json:"admin"`
	AvatarURL string  `json:"avatarUrl"`
}

// SerializeUser will convert a database user to a graphql user
func SerializeUser(user *models.User) SerializedUser {
	return SerializedUser{
		ID:        user.ID,
		Email:     user.Email,
		Admin:     user.Admin,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		AvatarURL: user.AvatarUrl(),
	}
}

// CurrentUser resolve net worth items
func CurrentUser(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	return SerializeUser(currentUser), nil

}
