package mutations

import (
	"strconv"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/pop"
	"github.com/graphql-go/graphql"
)

// BudgetItemDelete will delete a budget item
func BudgetItemDelete(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)
	idString, isOK := params.Args["id"].(string)
	if !isOK {
		return nil, nil
	}

	id, err := strconv.Atoi(idString)
	if err != nil {
		return nil, nil
	}

	item := &models.BudgetItem{ID: id}
	err = findBudgetItem(item, currentUser.ID)
	if err != nil {
		return nil, nil
	}

	// delete expenses (transactionally)
	err = models.DB.Transaction(func(tx *pop.Connection) error {
		expenseDeleteErrors := item.DestroyAllExpensesSilently(tx)
		if expenseDeleteErrors != nil {
			return nil
		}

		// delete item
		deleteErr := tx.Destroy(item)
		if deleteErr != nil {
			return nil
		}

		return nil
	})

	if err != nil {
		return nil, nil
	}

	var expenses []models.BudgetItemExpense
	item.BudgetItemExpenses = expenses
	return item, nil
}

func findBudgetItem(i *models.BudgetItem, userID int) error {
	q := `
    select
      budget_items.id,
      budget_items.budget_category_id,
      budget_items.name,
      budget_items.amount_budgeted,
      budget_items.created_at,
      budget_items.updated_at
    from budget_items
    join budget_categories on budget_categories.id=budget_items.budget_category_id
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_items.id = ?
    limit 1
  `
	err := models.DB.RawQuery(q, userID, i.ID).First(i)
	return err
}
