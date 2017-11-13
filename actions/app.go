package actions

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"strings"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/middleware"
	"github.com/gobuffalo/envy"
	"github.com/markbates/pop"

	"github.com/dillonhafer/budgetal-go/models"
	"github.com/gobuffalo/x/sessions"
	"github.com/rs/cors"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")
var app *buffalo.App

func WithCurrentUser(next func(buffalo.Context, *models.User) error) func(buffalo.Context) error {
	return func(c buffalo.Context) error {
		currentUser := c.Value("currentUser").(*models.User)
		return next(c, currentUser)
	}
}

func AuthorizeUser(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		errResp := map[string]string{"error": "You are not signed in"}
		// 1. Rebuild keys
		AuthenticationKey, err := c.Cookies().Get("_budgetal_session")
		if err != nil {
			c.Logger().Debug("Cookie not found")
			return c.Render(401, r.JSON(errResp))
		}
		AuthenticationToken := c.Request().Header.Get("X-Budgetal-Session")

		// 2. Get user from keys or 401
		tx := c.Value("tx").(*pop.Connection)

		session := &models.Session{}
		dbErr := tx.Where("authentication_key = ? and authentication_token = ? and expired_at is null", AuthenticationKey, AuthenticationToken).First(session)
		if dbErr != nil {
			c.Logger().Debug("Session not found or expired")
			return c.Render(401, r.JSON(errResp))
		}

		user := &models.User{}
		dbErr = tx.Find(user, session.UserID)
		if dbErr != nil {
			c.Logger().Debug("User not found")
			return c.Render(401, r.JSON(errResp))
		}

		user.CurrentSession = session

		c.Set("currentUser", user)
		return next(c)
	}
}

func DecodeJson(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		var err error
		var f interface{}
		req := c.Request()
		if req.Method != "GET" && req.Header.Get("Content-Type") == "application/json" && req.ContentLength > 0 {
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

func CorsPreware() *cors.Cors {
	allowedOrigins := strings.Split(envy.Get("CORS", "http://localhost:3001"), " ")
	return cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "PUT", "PATCH", "DELETE", "POST", "OPTIONS"},
		// Using a number to allow for case insensitivity
		AllowedHeaders: []string{"Accept", "Content-Type", "X-Budgetal-Session"},
	})
}

func App() *buffalo.App {
	if app == nil {
		app = buffalo.New(buffalo.Options{
			Env:          ENV,
			SessionStore: sessions.Null{},
			PreWares:     []buffalo.PreWare{CorsPreware().Handler},
		})

		app.ErrorHandlers[500] = func(status int, err error, c buffalo.Context) error {
			errResp := map[string]string{"error": "Something went wrong on our end. We are looking into the issue"}
			c.Logger().Errorf("\n💔 ERROR\n%v\n\n", err)
			return c.Render(500, r.JSON(errResp))
		}

		app.Use(DecodeJson)

		if ENV == "development" {
			app.Use(middleware.ParameterLogger)
		}

		app.Use(middleware.PopTransaction(models.DB))

		// Authorization
		app.Use(AuthorizeUser)

		// Non-authorized routes
		app.Middleware.Skip(AuthorizeUser, SignIn, UsersCreate, UsersPasswordResetRequest, UsersUpdatePassword)
		app.POST("/sign-in", SignIn)
		app.POST("/register", UsersCreate)
		app.POST("/reset-password", UsersPasswordResetRequest)
		app.PUT("/reset-password", UsersUpdatePassword)

		// Authorized routes
		app.DELETE("/sign-out", WithCurrentUser(SignOut))
		app.GET("/monthly-statistics/{year}/{month}", WithCurrentUser(MonthlyStatisticsShow))

		// Annual Budgets
		app.GET("/annual-budgets/{year}", WithCurrentUser(AnnualBudgetsIndex))
		app.POST("/annual-budget-items", WithCurrentUser(AnnualBudgetItemsCreate))
		app.PUT("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsUpdate))
		app.DELETE("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsDelete))

		// Users
		app.PATCH("/update-user", WithCurrentUser(UsersUpdate))
		app.PATCH("/update-password", WithCurrentUser(UsersChangePassword))

		// Admin
		app.GET("/admin/users", WithCurrentUser(AdminUsers))

		// Sessions
		app.GET("/sessions", WithCurrentUser(SessionsIndex))
		app.DELETE("/sessions/{authenticationKey}", WithCurrentUser(SessionsDelete))
	}

	return app
}
