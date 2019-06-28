package models

import (
	"encoding/json"
	"time"

	"github.com/fatih/color"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
)

type BudgetItem struct {
	ID                 int                 `json:"id" db:"id"`
	BudgetCategoryId   int                 `json:"budgetCategoryId" db:"budget_category_id"`
	Name               string              `json:"name" db:"name"`
	Amount             json.Number         `json:"amount" db:"amount_budgeted"`
	CreatedAt          time.Time           `json:"-" db:"created_at"`
	UpdatedAt          time.Time           `json:"-" db:"updated_at"`
	BudgetItemExpenses []BudgetItemExpense `json:"" db:"-"`
}

type BudgetItems []BudgetItem

func (budgetItem *BudgetItem) DestroyAllExpenses(tx *pop.Connection, logger buffalo.Logger) error {
	query := `
    delete from budget_item_expenses
    where budget_item_id = :id
  `
	logger.Debug(color.YellowString(query))

	_, err := tx.Store.NamedExec(query, budgetItem)
	return err
}

func (budgetItem *BudgetItem) Update(params *BudgetItem) error {
	if budgetItem.Name != params.Name {
		budgetItem.Name = params.Name
	}
	if budgetItem.Amount != params.Amount {
		budgetItem.Amount = params.Amount
	}
	return DB.Update(budgetItem)
}
