package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// AnnualBudget resolve annual budgets
func AnnualBudget(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)

	year, isOK := params.Args["year"].(int)
	if !isOK || !AllowedYear(year) {
		return nil, nil
	}

	annualBudget := models.AnnualBudget{UserID: currentUser.ID, Year: year}
	annualBudgetItems := models.AnnualBudgetItems{}
	annualBudget.FindOrCreate()
	models.DB.BelongsTo(&annualBudget).Order(`lower(name)`).All(&annualBudgetItems)
	annualBudget.AnnualBudgetItems = annualBudgetItems
	return annualBudget, nil
}
