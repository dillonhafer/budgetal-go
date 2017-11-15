package actions

import (
	"crypto/md5"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/dillonhafer/budgetal-go/mailers"
	"github.com/dillonhafer/budgetal-go/models"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	"github.com/markbates/pop"
	"github.com/markbates/pop/nulls"
)

func UsersChangePassword(c buffalo.Context, currentUser *models.User) error {
	password, _ := Json(c, "password").(string)
	currentPassword, _ := Json(c, "currentPassword").(string)

	if !currentUser.VerifyPassword(currentPassword) {
		return c.Render(401, r.JSON(map[string]string{"error": "Incorrect Password"}))
	}

	currentUser.EncryptPassword([]byte(password))
	tx := c.Value("tx").(*pop.Connection)
	tx.Update(currentUser)

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

	tx := c.Value("tx").(*pop.Connection)
	dbErr := tx.Update(currentUser)
	if dbErr != nil {
		return c.Render(401, r.JSON("Invalid User"))
	}

	return c.Render(200, r.JSON(map[string]*models.User{"user": currentUser}))
}

func UsersPasswordResetRequest(c buffalo.Context) error {
	tx := c.Value("tx").(*pop.Connection)
	email, _ := Json(c, "email").(string)
	user := &models.User{}
	err := tx.Where("email = ?", email).First(user)

	if err == nil {
		token := RandomHex(32)
		user.PasswordResetToken = nulls.String{String: token, Valid: true}
		user.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: true}
		err = tx.Update(user)
		if err == nil {
			err = mailers.SendPasswordResets(user)
			if err == nil {
				c.Logger().Debug(err)
			}
		}
	}

	return c.Render(200, r.JSON(""))
}

func UsersUpdatePassword(c buffalo.Context) error {
	token, _ := Json(c, "reset_password_token").(string)
	password, _ := Json(c, "password").(string)

	user := &models.User{}
	tx := c.Value("tx").(*pop.Connection)
	query := `
		password_reset_token = ? and
		password_reset_sent_at between
		(now() - interval '2 hours') and now()
	`
	err := tx.Where(query, token).First(user)
	if err != nil {
		return c.Render(401, r.JSON(""))
	}

	user.EncryptPassword([]byte(password))
	user.PasswordResetToken = nulls.String{String: "", Valid: false}
	user.PasswordResetSentAt = nulls.Time{Time: time.Now(), Valid: false}
	tx.Update(user)

	return c.Render(200, r.JSON(""))
}
