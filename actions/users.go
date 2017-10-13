package actions

import "github.com/gobuffalo/buffalo"

// UsersShow default implementation.
func UsersShow(c buffalo.Context) error {
	return c.Render(200, r.JSON(map[string]string{"users": "show"}))
}

// UsersCreate default implementation.
func UsersCreate(c buffalo.Context) error {
	return c.Render(200, r.JSON(map[string]string{"users": "create"}))
}
