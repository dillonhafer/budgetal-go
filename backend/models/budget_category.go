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

var SortOrder = map[string]int{
	"Charity":        0,
	"Saving":         1,
	"Housing":        2,
	"Utilities":      3,
	"Food":           4,
	"Clothing":       5,
	"Transportation": 6,
	"Medical/Health": 7,
	"Insurance":      8,
	"Personal":       9,
	"Recreation":     10,
	"Debts":          11,
}

type BudgetCategories []BudgetCategory

func (s BudgetCategories) Len() int {
	return len(s)
}
func (s BudgetCategories) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s BudgetCategories) Less(i, j int) bool {
	return SortOrder[s[i].Name] < SortOrder[s[j].Name]
}
