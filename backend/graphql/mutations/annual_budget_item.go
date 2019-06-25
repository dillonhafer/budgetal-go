package mutations

import (
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// AnnualBudgetItemDelete will delete an annaul budget item
func AnnualBudgetItemDelete(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)
	id, isOK := params.Args["id"].(int)
	if !isOK {
		return nil, nil
	}

	item := &models.AnnualBudgetItem{ID: id}
	findErr := findAnnualBudgetItem(item, currentUser.ID)
	if findErr != nil {
		return nil, nil
	}

	deleteErr := models.DB.Destroy(item)
	if deleteErr != nil {
		return nil, nil
	}

	annualBudget, findErr := findAnnualBudget(item.AnnualBudgetID, currentUser.ID)
	if findErr != nil {
		return nil, nil
	}

	return annualBudget, nil
}

// AnnualBudgetItemUpdate will update an annual budget item
func AnnualBudgetItemUpdate(params graphql.ResolveParams) (interface{}, error) {
	// currentUser := params.Context.Value("currentUser").(*models.User)
	return nil, nil
}

func findAnnualBudgetItem(i *models.AnnualBudgetItem, userID int) error {
	q := `
		select annual_budget_items.*
		from annual_budget_items
		join annual_budgets on annual_budget_items.annual_budget_id = annual_budgets.id
		where annual_budgets.user_id = ?
		and annual_budget_items.id = ?
		limit 1
	`
	err := models.DB.RawQuery(q, userID, i.ID).First(i)
	return err
}

func findAnnualBudget(id, userID int) (*models.AnnualBudget, error) {
	b := models.AnnualBudget{}
	err := models.DB.Where("user_id = ? and id = ?", userID, id).First(&b)
	return &b, err
}
