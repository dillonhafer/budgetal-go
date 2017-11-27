package models

import (
	"encoding/json"
	"time"

	"github.com/markbates/pop"
)

type BudgetItem struct {
	ID               int         `json:"id" db:"id"`
	BudgetCategoryId int         `json:"budgetCategoryId" db:"budget_category_id"`
	Name             string      `json:"name" db:"name"`
	Amount           json.Number `json:"amount" db:"amount_budgeted"`
	CreatedAt        time.Time   `json:"-" db:"created_at"`
	UpdatedAt        time.Time   `json:"-" db:"updated_at"`
}

type BudgetItems []BudgetItem

func (budgetItem *BudgetItem) DestroyAllExpenses(tx *pop.Connection) error {
	query := `
    delete from budget_item_expenses
    where budget_item_id = :id
  `
	_, err := tx.Store.NamedExec(query, budgetItem)
	return err
}
