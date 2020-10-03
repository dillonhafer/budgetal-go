package context

import (
	"context"
	"mime/multipart"

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
	FileUploadKey     = contextKey("fileUpload")
)

func CurrentUser(c context.Context) *models.User {
	return c.Value(CurrentUserKey).(*models.User)
}

func BuffaloContext(c context.Context) buffalo.Context {
	return c.Value(BuffaloContextKey).(buffalo.Context)
}

func FileUpload(c context.Context) (multipart.File, bool) {
	file, isOK := c.Value(FileUploadKey).(multipart.File)
	return file, isOK
}
