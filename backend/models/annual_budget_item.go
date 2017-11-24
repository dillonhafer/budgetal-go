package models

import (
	"encoding/json"
	"time"
)

type AnnualBudgetItem struct {
	ID             int         `json:"id" db:"id"`
	AnnualBudgetID int         `json:"annualBudgetId" db:"annual_budget_id"`
	Name           string      `json:"name" db:"name"`
	Amount         json.Number `json:"amount" db:"amount"`
	DueDate        string      `json:"dueDate" db:"due_date"`
	Interval       int         `json:"interval" db:"payment_intervals"`
	Paid           bool        `json:"paid" db:"paid"`
	CreatedAt      time.Time   `json:"-" db:"created_at"`
	UpdatedAt      time.Time   `json:"-" db:"updated_at"`
}
type AnnualBudgetItems []AnnualBudgetItem
