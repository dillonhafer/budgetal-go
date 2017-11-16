package actions

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal-go/models"
)

func (as *ActionSuite) Test_Budgets_Index() {
	as.SignedInUser()
	var resp struct {
		Budget           models.Budget
		BudgetCategories models.BudgetCategories
	}

	r := as.JSON("/budgets/2017/12").Get()
	as.Equal(200, r.Code)
	json.NewDecoder(r.Body).Decode(&resp)

	as.NotEmpty(resp.Budget.ID)
	as.Equal(2017, resp.Budget.Year)
	as.Equal(12, resp.Budget.Month)
	as.Equal("3500.00", resp.Budget.Income.String())

	as.Equal(12, len(resp.BudgetCategories))
	as.Equal(resp.Budget.ID, resp.BudgetCategories[0].BudgetId)
	as.Equal("Charity", resp.BudgetCategories[0].Name)
	as.Equal("Saving", resp.BudgetCategories[1].Name)
	as.Equal("Housing", resp.BudgetCategories[2].Name)
	as.Equal("Utilities", resp.BudgetCategories[3].Name)
	as.Equal("Food", resp.BudgetCategories[4].Name)
	as.Equal("Clothing", resp.BudgetCategories[5].Name)
	as.Equal("Transportation", resp.BudgetCategories[6].Name)
	as.Equal("Medical/Health", resp.BudgetCategories[7].Name)
	as.Equal("Insurance", resp.BudgetCategories[8].Name)
	as.Equal("Personal", resp.BudgetCategories[9].Name)
	as.Equal("Recreation", resp.BudgetCategories[10].Name)
	as.Equal("Debts", resp.BudgetCategories[11].Name)
}

func (as *ActionSuite) Test_Budgets_Index_CreatesDefaultCategories() {
	as.SignedInUser()

	count, _ := as.DB.Count(&models.Budgets{})
	as.Equal(0, count)

	count, _ = as.DB.Count(&models.BudgetCategories{})
	as.Equal(0, count)

	r := as.JSON("/budgets/2017/12").Get()
	as.Equal(200, r.Code, r.Body.String())

	count, _ = as.DB.Count(&models.Budgets{})
	as.Equal(1, count)

	count, _ = as.DB.Count(&models.BudgetCategories{})
	as.Equal(12, count)
}

func (as *ActionSuite) Test_Budgets_Index_CreatesMissingBudget() {
	as.SignedInUser()
	cookies := as.Willie.Cookies

	count, _ := as.DB.Count(&models.Budgets{})
	as.Equal(0, count)

	r := as.JSON("/budgets/2017/12").Get()
	as.Equal(200, r.Code, r.Body.String())
	as.Willie.Cookies = cookies

	count, _ = as.DB.Count(&models.Budgets{})
	as.Equal(1, count)

	// Idempotent
	rr := as.JSON("/budgets/2017/12").Get()
	as.Equal(200, rr.Code, rr.Body.String())
	count, _ = as.DB.Count(&models.Budgets{})
	as.Equal(1, count)
}

func (as *ActionSuite) Test_Budgets_Index_BadMonth() {
	SignedInUser(as)

	response := as.JSON("/budgets/2017/13").Get()
	as.Equal(404, response.Code)
}

func (as *ActionSuite) Test_Budgets_Index_BadYear() {
	SignedInUser(as)

	response := as.JSON("/budgets/1987/12").Get()
	as.Equal(404, response.Code)
}

func (as *ActionSuite) Test_Budgets_Index_RequiresUser() {
	r := as.JSON("/budgets/2017/12").Get()
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_Budgets_Update_ChangesIncome() {
	user := as.SignedInUser()
	budget := models.Budget{
		UserID: user.ID,
		Year:   2017,
		Month:  12,
		Income: json.Number("3000.00"),
	}
	as.DB.Create(&budget)
	count, _ := as.DB.Count(&models.Budgets{})
	as.Equal(1, count)

	r := as.JSON("/budgets/2017/12").Put(map[string]string{
		"income": "123.00",
	})
	responseBudget := models.Budget{}
	json.NewDecoder(r.Body).Decode(&responseBudget)
	as.Equal(200, r.Code, r.Body.String())
	as.Equal(budget.ID, responseBudget.ID)
	as.Equal(12, responseBudget.Month)
	as.Equal(2017, responseBudget.Year)
	as.Equal(json.Number("123.00"), responseBudget.Income)

	as.DB.Reload(&budget)
	as.Equal("123.00", budget.Income.String())
}

func (as *ActionSuite) Test_Budgets_Update_RequiresUser() {
	r := as.JSON("/budgets/2017/12").Put(map[string]string{})
	as.Equal(401, r.Code)
}
