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

func (a *AnnualBudgetItem) MarshalJSON() ([]byte, error) {
	type Alias AnnualBudgetItem
	return json.Marshal(&struct {
		*Alias
		DueDate string `json:"dueDate"`
	}{
		Alias:   (*Alias)(a),
		DueDate: a.DueDate[0:10],
	})
}

type AnnualBudgetItems []AnnualBudgetItem

func (item *AnnualBudgetItem) Update(params *AnnualBudgetItem) error {
	if item.Name != params.Name {
		item.Name = params.Name
	}
	if item.Amount != params.Amount {
		item.Amount = params.Amount
	}
	if item.DueDate != params.DueDate {
		item.DueDate = params.DueDate
	}
	if item.Interval != params.Interval {
		item.Interval = params.Interval
	}
	if item.Paid != params.Paid {
		item.Paid = params.Paid
	}
	return DB.Update(item)
}
