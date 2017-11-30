package actions

import (
	"encoding/json"
	"fmt"
	"sort"
	"testing"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/suite"
)

type ActionSuite struct {
	*suite.Action
}

func Test_ActionSuite(t *testing.T) {
	as := &ActionSuite{suite.NewAction(App())}
	suite.Run(t, as)
}

func SignedInUser(as *ActionSuite) models.User {
	return signInUser(false, as)
}

func (as *ActionSuite) SignedInUser() models.User {
	return signInUser(false, as)
}

func SignedInAdminUser(as *ActionSuite) models.User {
	return signInUser(true, as)
}

func (as *ActionSuite) CreateUser(admin bool) models.User {
	user := models.User{Email: "user@example.com", Admin: admin}
	user.EncryptPassword([]byte("password"))
	as.DB.Create(&user)
	return user
}

func (as *ActionSuite) CreateSession(userId int) models.Session {
	session := models.Session{
		UserAgent:           "TEST",
		AuthenticationToken: RandomHex(16),
		UserID:              userId,
		IpAddress:           "127.0.0.1",
	}
	session.Create()
	return session
}

func signInUser(admin bool, as *ActionSuite) models.User {
	// Create User
	user := as.CreateUser(admin)

	// Create Session
	session := as.CreateSession(user.ID)

	// Sign In User
	cookie := fmt.Sprintf("%s=%s; Expires=Tue, 09 Nov 2027 00:17:27 GMT; HttpOnly", AUTH_COOKIE_KEY, session.AuthenticationKey)
	as.Willie.Headers[AUTH_HEADER_KEY] = session.AuthenticationToken
	as.Willie.Cookies = cookie

	return user
}

func (as *ActionSuite) CreateBudget(userId, year, month int, income string) (models.Budget, models.BudgetCategories) {
	budget := models.Budget{
		UserID: userId,
		Year:   year,
		Month:  month,
		Income: json.Number(income),
	}
	as.DB.Create(&budget)
	budget.CreateDefaultCategories(as.DB)
	categories := models.BudgetCategories{}
	as.DB.BelongsTo(&budget).All(&categories)
	sort.Sort(categories)
	return budget, categories
}
