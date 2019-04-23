package actions

import (
	"encoding/json"
	"fmt"
	"sort"
	"testing"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/httptest"
	"github.com/gobuffalo/suite"
)

type ActionSuite struct {
	*suite.Action
}

func Test_ActionSuite(t *testing.T) {
	as := &ActionSuite{suite.NewAction(App())}
	suite.Run(t, as)
}

func (as *ActionSuite) CreateUser() models.User {
	return as.createUser(false)
}
func (as *ActionSuite) CreateAdminUser() models.User {
	return as.createUser(true)
}

func (as *ActionSuite) createUser(admin bool) models.User {
	user := models.User{Email: "user@example.com", Admin: admin}
	user.EncryptPassword([]byte("password"))
	models.DB.Create(&user)

	return user
}

func (as *ActionSuite) CreateSession(userID int) models.Session {
	session := models.Session{
		UserAgent:           "TEST",
		AuthenticationToken: RandomHex(16),
		UserID:              userID,
		IpAddress:           "127.0.0.1",
	}
	session.Create()

	return session
}

func (as *ActionSuite) Authenticate(user models.User) *httptest.Handler {
	session := as.CreateSession(user.ID)
	handler := httptest.New(as.App)

	// Set Auth Headers
	cookie := fmt.Sprintf("%s=%s; Expires=Tue, 09 Nov 2027 00:17:27 GMT; HttpOnly", AUTH_COOKIE_KEY, session.AuthenticationKey)
	handler.Cookies = cookie
	handler.Headers[AUTH_HEADER_KEY] = session.AuthenticationToken
	return handler
}

func (as *ActionSuite) AuthenticJSON(user models.User, url string) *httptest.JSON {
	return as.Authenticate(user).JSON(url)
}

func (as *ActionSuite) AuthenticHTML(user models.User, url string) *httptest.Request {
	return as.Authenticate(user).HTML(url)
}

func (as *ActionSuite) CreateBudget(userId, year, month int, income string) (models.Budget, models.BudgetCategories) {
	budget := models.Budget{
		UserID: userId,
		Year:   year,
		Month:  month,
		Income: json.Number(income),
	}
	as.DB.Create(&budget)
	budget.CreateDefaultCategories()
	categories := models.BudgetCategories{}
	as.DB.BelongsTo(&budget).All(&categories)
	sort.Sort(categories)
	return budget, categories
}
