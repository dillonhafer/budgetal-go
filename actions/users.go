package actions

import (
	"database/sql"
	"log"
	"time"

	"github.com/dillonhafer/budgetal/mailers"
	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
	"golang.org/x/crypto/bcrypt"
)

// UsersShow default implementation.
func UsersShow(c buffalo.Context) error {
	return c.Render(200, r.JSON(map[string]string{"users": "show"}))
}

func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}

// UsersCreate default implementation.
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
		user.PasswordResetToken = sql.NullString{String: token, Valid: true}
		user.PasswordResetSentAt = models.NullTime{Time: time.Now(), Valid: true}
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
	user.PasswordResetToken = sql.NullString{String: "", Valid: false}
	user.PasswordResetSentAt = models.NullTime{Time: time.Now(), Valid: false}
	tx.Update(user)

	return c.Render(200, r.JSON(""))
}
