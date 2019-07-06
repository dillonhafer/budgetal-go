package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/graphql-go/graphql"
)

// CurrentUser resolve net worth items
func CurrentUser(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)

	u := &struct {
		ID        int     `json:"id"`
		Email     string  `json:"email"`
		FirstName *string `json:"firstName"`
		LastName  *string `json:"lastName"`
		Admin     bool    `json:"admin"`
		AvatarURL string  `json:"avatarUrl"`
	}{
		ID:        currentUser.ID,
		Email:     currentUser.Email,
		Admin:     currentUser.Admin,
		FirstName: currentUser.NullableFirstName(),
		LastName:  currentUser.NullableLastName(),
		AvatarURL: currentUser.AvatarUrl(),
	}

	return u, nil
}
