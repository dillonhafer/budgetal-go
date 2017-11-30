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

func (e *BudgetItemExpense) MarshalJSON() ([]byte, error) {
	type Alias BudgetItemExpense
	return json.Marshal(&struct {
		*Alias
		Date string `json:"date"`
	}{
		Alias: (*Alias)(e),
		Date:  e.Date.Format("2006-01-02"),
	})
}

func (e *BudgetItemExpense) UnmarshalJSON(data []byte) error {
	type Alias BudgetItemExpense
	aux := &struct {
		*Alias
		Date string `json:"date"`
	}{
		Alias: (*Alias)(e),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	date, err := time.Parse("2006-01-02", aux.Date)
	if err != nil {
		return err
	}

	e.Date = date
	return nil
}
