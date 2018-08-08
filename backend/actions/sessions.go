package actions

import (
	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	uuid "github.com/gobuffalo/uuid"
)

type AllSessionsResponse struct {
	Active  []models.Session `json:"active"`
	Expired []models.Session `json:"expired"`
}

// SessionsIndex default implementation.
func SessionsIndex(c buffalo.Context, currentUser *models.User) error {
	sessions := &AllSessionsResponse{Active: []models.Session{}, Expired: []models.Session{}}

	models.DB.Where("expired_at is null and user_id = ?", currentUser.ID).All(&sessions.Active)
	models.DB.Where("expired_at is not null and user_id = ?", currentUser.ID).Order("expired_at desc").Limit(10).All(&sessions.Expired)

	return c.Render(200, r.JSON(map[string]*AllSessionsResponse{"sessions": sessions}))
}

func SessionsDelete(c buffalo.Context, currentUser *models.User) error {
	session := &models.Session{}
	authenticationKey, err := uuid.FromString(c.Param("authenticationKey"))

	if err != nil {
		return c.Render(422, r.JSON(map[string]bool{"ok": false}))
	}

	err = models.DB.Where("expired_at is null and user_id = ? and authentication_key = ?", currentUser.ID, authenticationKey).First(session)
	if err != nil {
		return c.Render(404, r.JSON(map[string]bool{"ok": false}))
	}

	q := session.Delete()
	c.Logger().Debug(q)

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}
