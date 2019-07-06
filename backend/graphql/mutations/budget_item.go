package mutations

import (
	"encoding/json"
	"strconv"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/pop"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

// BudgetItemDelete will delete a budget item
func BudgetItemDelete(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
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

type budgetItemInput struct {
	ID               string  `mapstructure:"id"`
	BudgetCategoryID int     `mapstructure:"budgetCategoryId"`
	Name             string  `mapstructure:"name"`
	Amount           float64 `mapstructure:"amount"`
}

// BudgetItemUpsert will insert or update a budget item
func BudgetItemUpsert(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	input := budgetItemInput{}
	err := mapstructure.Decode(params.Args["budgetItemInput"], &input)
	if err != nil {
		return nil, nil
	}

	item := &models.BudgetItem{}
	id, err := strconv.Atoi(input.ID)

	if err == nil {
		// Update
		item.ID = id
		err = findBudgetItem(item, currentUser.ID)
		if err != nil {
			return nil, nil
		}

		item.Name = input.Name
		item.Amount = json.Number(strconv.FormatFloat(input.Amount, 'f', -1, 64))

		err = models.DB.Update(item)
		if err != nil {
			return nil, nil
		}
	} else {
		// Create
		category, err := findBudgetCategory(input.BudgetCategoryID, currentUser.ID)
		if err != nil {
			return nil, nil
		}

		item.BudgetCategoryId = category.ID
		item.Name = input.Name
		item.Amount = json.Number(strconv.FormatFloat(input.Amount, 'f', -1, 64))

		err = models.DB.Create(item)
		if err != nil {
			return nil, nil
		}
	}

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
