package actions

import (
	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop/nulls"
)

// SignIn default implementation.
func SignIn(c buffalo.Context) error {
	var params struct {
		Email      string `json:"email"`
		Password   string `json:"password"`
		DeviceName string `json:"deviceName"`
	}
	var response struct {
		Token string       `json:"token"`
		User  *models.User `json:"user"`
	}
	err := map[string]string{"error": "Incorrect Email or Password"}

	if err := BindParams(c, &params); err != nil {
		return err
	}

	// 1. look up user from email
	//    return error if no user is found
	user := &models.User{}
	dbErr := models.DB.Where("email = ?", params.Email).First(user)
	if dbErr != nil {
		return c.Render(422, r.JSON(err))
	}

	// 2. check if password is valid
	//    return error if no user is found
	authentic := user.VerifyPassword(params.Password)
	if authentic == false {
		return c.Render(422, r.JSON(err))
	}

	// 3. create session
	ipAddress := c.Request().Header.Get("X-Real-IP")
	if ipAddress == "" {
		ipAddress = c.Request().RemoteAddr
	}

	deviceNameValid := params.DeviceName != ""
	deviceName := nulls.String{params.DeviceName, deviceNameValid}

	session := &models.Session{
		UserAgent:           c.Request().UserAgent(),
		AuthenticationToken: RandomHex(16),
		UserID:              user.ID,
		IpAddress:           ipAddress,
		DeviceName:          deviceName,
	}
	query := session.Create()
	c.Logger().Debug(query)

	// 4. set cookie
	SetAuthenticationCookie(c.Response(), session.AuthenticationKey)

	// 5. send token
	response.Token = session.AuthenticationToken
	response.User = user
	return c.Render(200, r.JSON(response))
}
