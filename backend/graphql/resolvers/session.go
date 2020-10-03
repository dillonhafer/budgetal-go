package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

type allSessionsResponse struct {
	Active  []models.Session `json:"active"`
	Expired []models.Session `json:"expired"`
}

// Sessions resolve sessions
func Sessions(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	sessions := &allSessionsResponse{Active: []models.Session{}, Expired: []models.Session{}}

	models.DB.Where("expired_at is null and user_id = ?", currentUser.ID).All(&sessions.Active)
	models.DB.Where("expired_at is not null and user_id = ?", currentUser.ID).Order("expired_at desc").Limit(10).All(&sessions.Expired)

	return sessions, nil
}
