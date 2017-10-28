package actions

import (
	"bytes"
	"encoding/json"
	"io/ioutil"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/middleware"
	"github.com/gobuffalo/envy"
	"github.com/markbates/pop"

	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/x/sessions"
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
			return c.Render(401, r.JSON(errResp))
		}
		AuthenticationToken := c.Request().Header.Get("_budgetal_session")

		// 2. Get user from keys or 401
		tx := c.Value("tx").(*pop.Connection)

		session := &models.Session{}
		dbErr := tx.Where("authentication_key = ? and authentication_token = ? and expired_at is null", AuthenticationKey, AuthenticationToken).First(session)
		if dbErr != nil {
			return c.Render(401, r.JSON(errResp))
		}

		user := &models.User{}
		dbErr = tx.Find(user, session.UserID)
		if dbErr != nil {
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
		if req.Method != "GET" && req.Header.Get("Content-Type") == "application/json" {
			body, err := ioutil.ReadAll(req.Body)
			if err == nil {
				if err = json.Unmarshal([]byte(body), &f); err == nil {
					c.Set("JSON", f)
					c.LogField("json", f)
				}
			} else {
				errResp := map[string]string{"error": "Bad Request"}
				return c.Render(401, r.JSON(errResp))
			}
			req.Body = ioutil.NopCloser(bytes.NewBuffer(body))
		}
		err = next(c)
		return err
	}
}

// App is where all routes and middleware for buffalo
// should be defined. This is the nerve center of your
// application.
func App() *buffalo.App {
	if app == nil {
		app = buffalo.New(buffalo.Options{
			Env:          ENV,
			SessionStore: sessions.Null{},
		})

		app.ErrorHandlers[500] = func(status int, err error, c buffalo.Context) error {
			res := c.Response()
			res.WriteHeader(500)
			errResp := map[string]string{"error": "Something went wrong on our end. We are looking into the issue"}
			c.Logger().Errorf("\n❌  ERROR\n%v\n\n", err)
			return c.Render(500, r.JSON(errResp))
		}

		// Set the request content type to JSON
		app.Use(middleware.SetContentType("application/json"))
		app.Use(DecodeJson)

		if ENV == "development" {
			app.Use(middleware.ParameterLogger)
		}

		// Wraps each request in a transaction.
		//  c.Value("tx").(*pop.PopTransaction)
		// Remove to disable this.
		app.Use(middleware.PopTransaction(models.DB))

		// Authorization
		app.Use(AuthorizeUser)

		// Non-authorized routes
		app.Middleware.Skip(AuthorizeUser, SignIn, UsersCreate, UsersPasswordResetRequest)
		app.POST("/sign-in", SignIn)
		app.POST("/register", UsersCreate)
		app.POST("/reset-password", UsersPasswordResetRequest)

		// Authorized routes
		app.DELETE("/sign-out", WithCurrentUser(SignOut))
		app.GET("/monthly-statistics/{year}/{month}", WithCurrentUser(MonthlyStatisticsShow))

		// Annual Budgets
		app.GET("/annual-budgets/{year}", WithCurrentUser(AnnualBudgetsIndex))
		app.POST("/annual-budget-items", WithCurrentUser(AnnualBudgetItemsCreate))
		app.PUT("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsUpdate))
		app.DELETE("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsDelete))
		app.GET("/admin/users", WithCurrentUser(AdminUsers))
	}

	return app
}
