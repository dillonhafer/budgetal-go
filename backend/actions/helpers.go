package actions

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gobuffalo/buffalo"
	uuid "github.com/satori/go.uuid"
)

func AllowedYear(year int) bool {
	currentYear := time.Now().Local().Year()
	return year > 2014 && year < currentYear+4
}

func AllowedMonth(month int) bool {
	return month > 0 && month < 13
}

func Json(c buffalo.Context, key string) interface{} {
	for k, v := range c.Data()["JSON"].(map[string]interface{}) {
		if k == key {
			return v
		}
	}
	return nil
}

func bodyHasJson(r *http.Request) bool {
	return r.Method != "GET" &&
		r.Header.Get("Content-Type") == "application/json" &&
		r.ContentLength > 0
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

func DecodeJson(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		var err error
		var f interface{}
		req := c.Request()
		if bodyHasJson(req) {
			body, err := ioutil.ReadAll(req.Body)
			if err == nil {
				if err = json.Unmarshal([]byte(body), &f); err == nil {
					c.Set("JSON", f)
					if ENV == "development" {
						c.LogField("json", f)
					}
				}
			} else {
				errResp := map[string]string{"error": "Bad Request"}
				return c.Render(422, r.JSON(errResp))
			}
			req.Body = ioutil.NopCloser(bytes.NewBuffer(body))
		}
		err = next(c)
		return err
	}
}
