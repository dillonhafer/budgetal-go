package actions

import (
	"crypto/md5"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	"github.com/markbates/pop/nulls"
)

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
		return c.Render(401, r.JSON(map[string]string{"error": "Incorrect Password"}))
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
		return c.Render(401, r.JSON(map[string]string{"error": "Incorrect Password"}))
	}

	// Update Attributes
	currentUser.FirstName = c.Request().FormValue("firstName")
	currentUser.LastName = c.Request().FormValue("lastName")
	currentUser.Email = c.Request().FormValue("email")

	// Update Avatar
	func() {
		file, _, err := c.Request().FormFile("avatar")
		if err != nil {
			return
		}
		defer file.Close()

		// Get MD5 filename
		hash := md5.New()
		var result []byte
		if _, err := io.Copy(hash, file); err != nil {
			return
		}
		fileMD5 := hash.Sum(result)
		file.Seek(0, 0)

		// Extension
		// Only the first 512 bytes are used to sniff the content type.
		extBuffer := make([]byte, 512)
		_, err = file.Read(extBuffer)
		if err != nil {
			return
		}
		contentType := http.DetectContentType(extBuffer)

		var extension string
		switch contentType {
		case "image/png":
			extension = "png"
		case "image/jpg":
		case "image/jpeg":
			extension = "jpg"
		default:
			return
		}
		filename := fmt.Sprintf("%x.%s", fileMD5, extension)
		file.Seek(0, 0)

		// Make paths
		userId := strconv.Itoa(currentUser.ID)

		avatarBase := envy.Get("AVATAR_BASE", filepath.Join("frontend", "public"))
		profilePath := filepath.Join("users", "avatars", userId)
		fullPath := filepath.Join(avatarBase, profilePath)

		// Save File
		os.MkdirAll(fullPath, os.ModePerm)
		imagePath := filepath.Join(fullPath, filename)
		f, err := os.OpenFile(imagePath, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			return
		}
		defer f.Close()
		io.Copy(f, file)

		// Update user
		databasePath := filepath.Join(profilePath, filename)
		currentUser.AvatarFileName = nulls.String{String: "/" + databasePath, Valid: true}
	}()

	dbErr := models.DB.Update(currentUser)
	if dbErr != nil {
		return c.Render(401, r.JSON("Invalid User"))
	}

	return c.Render(200, r.JSON(map[string]*models.User{"user": currentUser}))
}
