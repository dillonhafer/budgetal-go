package mutations

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

// BudgetItemExpenseDelete will delete a budget item expense
func BudgetItemExpenseDelete(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	idString, isOK := params.Args["id"].(string)
	if !isOK {
		return nil, nil
	}

	id, err := strconv.Atoi(idString)
	if err != nil {
		return nil, nil
	}

	expense := &models.BudgetItemExpense{ID: id}
	err = findBudgetItemExpense(expense, currentUser.ID)
	if err != nil {
		return nil, nil
	}

	deleteErr := models.DB.Destroy(expense)
	if deleteErr != nil {
		return nil, nil
	}

	return expense, nil
}

type budgetItemExpenseInput struct {
	ID           string  `mapstructure:"id"`
	BudgetItemID int     `mapstructure:"budgetItemId"`
	Name         string  `mapstructure:"name"`
	Amount       float64 `mapstructure:"amount"`
	Date         string  `mapstructure:"date"`
}

// BudgetItemExpenseUpsert will insert or update a budget item expense
func BudgetItemExpenseUpsert(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	input := budgetItemExpenseInput{}
	err := mapstructure.Decode(params.Args["budgetItemExpenseInput"], &input)
	if err != nil {
		return nil, nil
	}

	expense := &models.BudgetItemExpense{}
	id, err := strconv.Atoi(input.ID)

	if err == nil {
		// Update
		expense.ID = id
		err = findBudgetItemExpense(expense, currentUser.ID)
		if err != nil {
			return nil, nil
		}

		expense.Name = input.Name
		expense.Amount = json.Number(strconv.FormatFloat(input.Amount, 'f', -1, 64))
		date, err := time.Parse("2006-01-02", input.Date)
		if err != nil {
			return nil, nil
		}
		expense.Date = date

		err = models.DB.Update(expense)
		if err != nil {
			return nil, nil
		}
	} else {
		// Create
		item := &models.BudgetItem{ID: input.BudgetItemID}
		err := findBudgetItem(item, currentUser.ID)
		if err != nil {
			return nil, nil
		}

		expense.BudgetItemId = item.ID
		expense.Name = input.Name
		expense.Amount = json.Number(strconv.FormatFloat(input.Amount, 'f', -1, 64))
		date, err := time.Parse("2006-01-02", input.Date)
		if err != nil {
			return nil, nil
		}
		expense.Date = date

		err = models.DB.Create(expense)
		if err != nil {
			return nil, nil
		}
	}

	return expense, nil
}

func findBudgetItemExpense(e *models.BudgetItemExpense, userID int) error {
	q := `
    select
      budget_item_expenses.id,
      budget_item_expenses.budget_item_id,
      budget_item_expenses.name,
      budget_item_expenses.amount,
      budget_item_expenses.date,
      budget_item_expenses.created_at,
      budget_item_expenses.updated_at
    from budget_item_expenses
    join budget_items on budget_items.id = budget_item_expenses.budget_item_id
    join budget_categories on budget_categories.id=budget_items.budget_category_id
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_item_expenses.id = ?
    limit 1
  `
	return models.DB.RawQuery(q, userID, e.ID).First(e)
}
