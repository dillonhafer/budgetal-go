package models

import (
	"encoding/json"
	"time"
)

type BudgetItemExpense struct {
	ID           int         `json:"id" db:"id"`
	BudgetItemId int         `json:"budgetItemId" db:"budget_item_id"`
	Name         string      `json:"name" db:"name"`
	Amount       json.Number `json:"amount" db:"amount"`
	Date         time.Time   `json:"date" db:"date"`
	CreatedAt    time.Time   `json:"-" db:"created_at"`
	UpdatedAt    time.Time   `json:"-" db:"updated_at"`
}

type BudgetItemExpenses []BudgetItemExpense
