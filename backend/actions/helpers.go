package actions

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/gobuffalo/buffalo"
	uuid "github.com/gobuffalo/uuid"
)

func AllowedYear(year int) bool {
	currentYear := time.Now().Local().Year()
	return year > 2014 && year < currentYear+4
}

func AllowedNetWorthYear(year int) bool {
	return year > 1900 && year < 2100
}

func AllowedMonth(month int) bool {
	return month > 0 && month < 13
}

func BindParams(c buffalo.Context, params interface{}) error {
	if err := c.Bind(params); err != nil {
		return err
	}
	if ENV != "production" {
		c.LogField("json", fmt.Sprintf("%#v", params))
	}

	return nil
}

func SetAuthenticationCookie(res http.ResponseWriter, value uuid.UUID) {
	cookie := &http.Cookie{
		Expires:  time.Now().Add(time.Hour * 87600),
		Name:     AUTH_COOKIE_KEY,
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
