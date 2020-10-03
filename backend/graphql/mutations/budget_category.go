package mutations

import (
	"strconv"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// BudgetCategoryImport will delete an annaul budget item
func BudgetCategoryImport(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	idString, isOK := params.Args["id"].(string)
	if !isOK {
		return nil, nil
	}
	id, err := strconv.Atoi(idString)
	if err != nil {
		return nil, nil
	}

	category, err := findBudgetCategory(id, currentUser.ID)
	if err != nil {
		return nil, nil
	}

	message, _ := category.ImportPreviousItems()
	var resp = struct {
		Message string `json:"message"`
	}{
		message,
	}

	return resp, nil
}

func findBudgetCategory(categoryID, userID int) (models.BudgetCategory, error) {
	c := models.BudgetCategory{}
	q := `
    select budget_categories.*
      from budget_categories
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_categories.id = ?
    limit 1
  `
	err := models.DB.RawQuery(q, userID, categoryID).First(&c)
	return c, err
}
