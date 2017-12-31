package actions

import (
	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/fatih/color"
	"github.com/gobuffalo/buffalo"
)

func UsersUpdatePushNotificationToken(c buffalo.Context, currentUser *models.User) error {
	var params = struct {
		PushNotificationToken string `json:"token"`
	}{
		"",
	}
	if err := BindParams(c, &params); err != nil {
		return err
	}

	if params.PushNotificationToken != "" {
		currentUser.AppendPushNotificationToken(params.PushNotificationToken)
	}

	return c.Render(200, r.JSON(map[string]string{"message": "ok"}))
}

func UsersChangePassword(c buffalo.Context, currentUser *models.User) error {
	var params = struct {
		Password        string `json:"password"`
		CurrentPassword string `json:"currentPassword"`
	}{
		"",
		"",
	}
	if err := c.Bind(&params); err != nil {
		return err
	}

	if !currentUser.VerifyPassword(params.CurrentPassword) {
		return c.Render(422, r.JSON(map[string]string{"error": "Incorrect Password"}))
	}

	currentUser.EncryptPassword([]byte(params.Password))
	models.DB.Update(currentUser)

	return c.Render(200, r.JSON(map[string]string{"message": "Password Successfully Changed"}))
}

func UsersUpdate(c buffalo.Context, currentUser *models.User) error {
	// Verify Password
	// or error
	currentPassword := c.Request().FormValue("password")
	if !currentUser.VerifyPassword(currentPassword) {
		return c.Render(422, r.JSON(map[string]string{"error": "Incorrect Password"}))
	}

	// Update Attributes
	currentUser.FirstName = c.Request().FormValue("firstName")
	currentUser.LastName = c.Request().FormValue("lastName")
	currentUser.Email = c.Request().FormValue("email")

	// Update Avatar
	file, _, err := c.Request().FormFile("avatar")
	if err == nil {
		defer file.Close()

		err = currentUser.SaveAvatar(file)
		if err != nil {
			c.Logger().Debug(color.RedString(err.Error()))
			return c.Render(422, r.JSON(map[string]string{
				"error": "Could not save avatar",
			}))
		}
	}

	dbErr := models.DB.Update(currentUser)
	if dbErr != nil {
		return c.Render(422, r.JSON("Invalid User"))
	}

	return c.Render(200, r.JSON(map[string]*models.User{"user": currentUser}))
}
