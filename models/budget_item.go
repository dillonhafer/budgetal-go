package models

import (
	"encoding/json"
	"time"
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
