package mutations

import (
	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/gobuffalo/nulls"
	"github.com/graphql-go/graphql"
)

// UpdatePushNotificationToken will update the current session's push notification token
func UpdatePushNotificationToken(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	token, isOK := params.Args["token"].(string)
	if !isOK {
		return nil, nil
	}

	currentUser.CurrentSession.UpdatePushNotificationToken(nulls.String{String: token, Valid: true})
	return currentUser, nil
}
