package actions

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/dillonhafer/budgetal-go/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

func Json(c buffalo.Context, key string) interface{} {
	for k, v := range c.Data()["JSON"].(map[string]interface{}) {
		if k == key {
			return v
		}
	}
	return nil
}

func Compare(password string, hashedPassword string) bool {
	if hashedPassword == "" {
		return false
	}

	var passwordBuffer bytes.Buffer
	passwordBuffer.WriteString(password)

	val := bcrypt.CompareHashAndPassword([]byte(hashedPassword), passwordBuffer.Bytes())

	return (val == nil)
}

// SignIn default implementation.
func SignIn(c buffalo.Context) error {
	var ok bool
	var params struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var response struct {
		Token string       `json:"token"`
		User  *models.User `json:"user"`
	}
	err := map[string]string{"error": "Incorrect Email or Password"}
	params.Email, ok = Json(c, "email").(string)
	if !ok {
		return c.Render(401, r.JSON(err))
	}

	params.Password, ok = Json(c, "password").(string)
	if !ok {
		return c.Render(401, r.JSON(err))
	}

	// 1. look up user from email
	//    return error if no user is found
	tx := c.Value("tx").(*pop.Connection)
	user := &models.User{}
	dbErr := tx.Where("email = ?", params.Email).First(user)
	if dbErr != nil {
		return c.Render(401, r.JSON(err))
	}

	// 2. check if password is valid
	//    return error if no user is found
	authentic := Compare(params.Password, user.EncryptedPassword)
	if authentic == false {
		return c.Render(401, r.JSON(err))
	}

	// 3. create session
	ipAddress := c.Request().Header.Get("X-Real-IP")
	if ipAddress == "" {
		ipAddress = c.Request().RemoteAddr
	}

	session := &models.Session{
		UserAgent:           c.Request().UserAgent(),
		AuthenticationToken: RandomHex(16),
		UserID:              user.ID,
		IpAddress:           ipAddress,
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

func SetAuthenticationCookie(res http.ResponseWriter, value uuid.UUID) {
	cookie := &http.Cookie{
		Expires:  time.Now().Add(time.Hour * 87600),
		Name:     "_budgetal_session",
		Value:    value.String(),
		Secure:   ENV == "production",
		HttpOnly: true,
	}
	http.SetCookie(res, cookie)
}

func RandomBytes(n int) []byte {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return b
}

func RandomHex(s int) string {
	b := RandomBytes(s)
	hexstring := hex.EncodeToString(b)
	return hexstring
}
