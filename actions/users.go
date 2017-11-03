package actions

import (
	"crypto/md5"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/dillonhafer/budgetal/mailers"
	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	"github.com/markbates/pop"
	"github.com/markbates/pop/nulls"
	"golang.org/x/crypto/bcrypt"
)

func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}

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
			c.Logger().Debug("WRONG CONTENT TYPE")
			c.Logger().Debug(contentType)
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

func UsersCreate(c buffalo.Context) error {
	var ok bool
	var params struct {
		Email    string `json:"email"`
		Password []byte `json:"password"`
	}
	var response struct {
		Token string       `json:"token"`
		User  *models.User `json:"user"`
	}
	err := map[string]string{"error": "Invalid email or password"}
	params.Email, ok = Json(c, "email").(string)
	if !ok {
		return c.Render(401, r.JSON(err))
	}

	passwordString, ok := Json(c, "password").(string)
	if !ok {
		return c.Render(401, r.JSON(err))
	}
	params.Password = []byte(passwordString)

	// 1. look up user from email
	//    return error if no user is found
	tx := c.Value("tx").(*pop.Connection)
	user := &models.User{Email: params.Email, EncryptedPassword: hashAndSalt(params.Password)}
	dbErr := tx.Create(user)
	if dbErr != nil {
		return c.Render(401, r.JSON(err))
	}

	// 3. create session
	session := &models.Session{
		UserAgent:           c.Request().UserAgent(),
		AuthenticationToken: RandomHex(16),
		UserID:              user.ID,
		IpAddress:           c.Request().RemoteAddr,
	}
	query := session.Create(tx)
	c.Logger().Debug(query)

	// 4. set cookie
	SetAuthenticationCookie(c.Response(), session.AuthenticationKey)

	// 5. send token
	response.Token = session.AuthenticationToken
	response.User = user
	return c.Render(200, r.JSON(response))
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
			mailers.SendPasswordResets(user)
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
