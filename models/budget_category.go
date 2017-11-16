package models

import (
	"time"
)

type BudgetCategory struct {
	ID         int       `json:"id" db:"id"`
	BudgetId   int       `json:"budgetId" db:"budget_id"`
	Name       string    `json:"name" db:"name"`
	Percentage string    `json:"percentage" db:"percentage"`
	CreatedAt  time.Time `json:"-" db:"created_at"`
	UpdatedAt  time.Time `json:"-" db:"updated_at"`
}

type BudgetCategories []BudgetCategory
