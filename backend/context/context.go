package context

import (
	"context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo"
)

type contextKey string

func (c contextKey) String() string {
	return "budgetal-context: " + string(c)
}

var (
	CurrentUserKey    = contextKey("currentUser")
	BuffaloContextKey = contextKey("buffaloContext")
)

func CurrentUser(c context.Context) *models.User {
	return c.Value(CurrentUserKey).(*models.User)
}

func BuffaloContext(c context.Context) buffalo.Context {
	return c.Value(BuffaloContextKey).(buffalo.Context)
}