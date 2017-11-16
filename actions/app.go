package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/middleware"
	"github.com/gobuffalo/envy"
	"github.com/markbates/pop"

	"github.com/dillonhafer/budgetal-go/models"
	"github.com/gobuffalo/x/sessions"
)

var AUTH_HEADER_KEY = envy.Get("BUDGETAL_HEADER", "X-Budgetal-Session")
var AUTH_COOKIE_KEY = envy.Get("BUDGETAL_COOKIE", "_budgetal_session")

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
		AuthenticationKey, err := c.Cookies().Get(AUTH_COOKIE_KEY)
		if err != nil {
			c.Logger().Debug("Cookie not found")
			return c.Render(401, r.JSON(errResp))
		}
		AuthenticationToken := c.Request().Header.Get(AUTH_HEADER_KEY)

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
		app.Middleware.Skip(AuthorizeUser, SignIn, RegisterUser, PasswordResetRequest, ResetPassword)
		app.POST("/sign-in", SignIn)
		app.POST("/register", RegisterUser)
		app.POST("/reset-password", PasswordResetRequest)
		app.PUT("/reset-password", ResetPassword)

		//
		// Authorized routes
		//
		////////////////////

		// Monthly Statistics
		app.GET("/monthly-statistics/{year}/{month}", WithCurrentUser(MonthlyStatisticsShow))

		// Annual Budgets
		app.GET("/annual-budgets/{year}", WithCurrentUser(AnnualBudgetsIndex))
		app.POST("/annual-budget-items", WithCurrentUser(AnnualBudgetItemsCreate))
		app.PUT("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsUpdate))
		app.DELETE("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsDelete))

		// Users
		app.PATCH("/update-user", WithCurrentUser(UsersUpdate))
		app.PUT("/update-user", WithCurrentUser(UsersUpdate))
		app.PATCH("/update-password", WithCurrentUser(UsersChangePassword))

		// Admin
		app.GET("/admin/users", WithCurrentUser(AdminUsers))

		// Sessions
		app.GET("/sessions", WithCurrentUser(SessionsIndex))
		app.DELETE("/sign-out", WithCurrentUser(SignOut))
		app.DELETE("/sessions/{authenticationKey}", WithCurrentUser(SessionsDelete))

		// Budgets
		app.GET("/budgets/{year}/{month}", WithCurrentUser(BudgetsIndex))
		app.PUT("/budgets/{year}/{month}", WithCurrentUser(BudgetsUpdate))
	}

	return app
}
