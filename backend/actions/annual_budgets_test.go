package actions

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ActionSuite) Test_AnnualBudgets_Index_CreatesMissingBudget() {
	user := as.CreateUser()

	annualBudgets := &models.AnnualBudgets{}
	count, _ := as.DB.Count(annualBudgets)

	as.Equal(count, 0)

	r := as.AuthenticJSON(user, "/annual-budgets/2017").Get()
	as.Equal(200, r.Code)
	var rb struct {
		AnnualBudgetID    int                      `json:"annualBudgetId"`
		AnnualBudgetItems models.AnnualBudgetItems `json:"annualBudgetItems"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	b := &models.AnnualBudget{}
	as.DB.First(b)
	as.Equal(b.ID, rb.AnnualBudgetID)

	count, _ = as.DB.Count(annualBudgets)
	as.Equal(count, 1)

	// Idempotent
	as.AuthenticJSON(user, "/annual-budgets/2017").Get()
	count, _ = as.DB.Count(annualBudgets)
	as.Equal(count, 1)
}

func (as *ActionSuite) Test_AnnualBudgets_Index_ReturnsBudgetItems() {
	user := as.CreateUser()
	b := models.AnnualBudget{Year: 2017, UserID: user.ID}
	b.FindOrCreate()
	i := models.AnnualBudgetItem{
		AnnualBudgetID: b.ID,
		Amount:         json.Number("0.00"),
		Name:           "Insurance",
		DueDate:        "2017-12-12",
		Paid:           true,
		Interval:       8,
	}
	as.DB.Create(&i)

	r := as.AuthenticJSON(user, "/annual-budgets/2017").Get()
	as.Equal(200, r.Code)
	var rb struct {
		AnnualBudgetID    int                      `json:"annualBudgetId"`
		AnnualBudgetItems models.AnnualBudgetItems `json:"annualBudgetItems"`
	}
	json.NewDecoder(r.Body).Decode(&rb)

	as.Equal("2017-12-12", rb.AnnualBudgetItems[0].DueDate)
}

func (as *ActionSuite) Test_AnnualBudgets_Index_BadYear() {
	user := as.CreateUser()
	response := as.AuthenticJSON(user, "/annual-budgets/abcd").Get()
	as.Equal(404, response.Code)
}

func (as *ActionSuite) Test_AnnualBudgets_Index_LowYear() {
	user := as.CreateUser()
	response := as.AuthenticJSON(user, "/annual-budgets/2014").Get()
	as.Equal(404, response.Code)
}

func (as *ActionSuite) Test_AnnualBudgets_Index_HighYear() {
	user := as.CreateUser()
	url := fmt.Sprintf("/annual-budgets/%d", time.Now().Local().Year()+4)

	response := as.AuthenticJSON(user, url).Get()
	as.Equal(404, response.Code)
}

func (as *ActionSuite) Test_AnnualBudgets_Index_RequiresUser() {
	r := as.JSON("/annual-budgets/2017").Get()
	as.Equal(401, r.Code)
}
