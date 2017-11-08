package actions

import "github.com/dillonhafer/budgetal-go/models"

func (as *ActionSuite) Test_AnnualBudgets_Index_CreatesMissingBudget() {
	SignedInUser(as)

	annualBudgetItems := &models.AnnualBudgets{}
	count, _ := as.DB.Count(annualBudgetItems)

	as.Equal(count, 0)

	as.JSON("/annual-budgets/2017").Get()
	count, _ = as.DB.Count(annualBudgetItems)
	as.Equal(count, 1)

	// Idempotent
	as.JSON("/annual-budgets/2017").Get()
	count, _ = as.DB.Count(annualBudgetItems)
	as.Equal(count, 1)
}

func (as *ActionSuite) Test_AnnualBudgets_Index_BadYear() {
	SignedInUser(as)

	response := as.JSON("/annual-budgets/abcd").Get()
	as.Equal(404, response.Code)
}
