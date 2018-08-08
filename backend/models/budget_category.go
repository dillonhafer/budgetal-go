package models

import (
	"fmt"
	"time"

	"github.com/gobuffalo/pop"
)

type BudgetCategory struct {
	ID         int       `json:"id" db:"id"`
	BudgetId   int       `json:"budgetId" db:"budget_id"`
	Name       string    `json:"name" db:"name"`
	Percentage string    `json:"percentage" db:"percentage"`
	CreatedAt  time.Time `json:"-" db:"created_at"`
	UpdatedAt  time.Time `json:"-" db:"updated_at"`
}

var CategorySortOrder = map[string]int{
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
	return CategorySortOrder[s[i].Name] < CategorySortOrder[s[j].Name]
}

func (budgetCategory *BudgetCategory) ImportPreviousItems() (string, BudgetItems) {
	budget := Budget{}
	DB.Find(&budget, budgetCategory.BudgetId)

	var previousMonth, previousYear int
	if budget.Month > 1 {
		previousMonth = budget.Month - 1
		previousYear = budget.Year
	} else {
		previousMonth = 12
		previousYear = budget.Year - 1
	}

	previousBudget := Budget{}
	previousBudgetCategory := BudgetCategory{}
	DB.Where(`
		user_id = ? and year = ? and month = ?
	`, budget.UserID, previousYear, previousMonth).First(&previousBudget)
	DB.BelongsTo(&previousBudget).Where(`name = ?`, budgetCategory.Name).First(&previousBudgetCategory)

	previousItems := BudgetItems{}
	DB.BelongsTo(&previousBudgetCategory).Order(`created_at`).All(&previousItems)

	// Transactionally import all items
	newItems := BudgetItems{}
	DB.Transaction(func(tx *pop.Connection) error {
		for _, item := range previousItems {
			newItem := BudgetItem{
				BudgetCategoryId: budgetCategory.ID,
				Name:             item.Name,
				Amount:           item.Amount,
			}
			err := tx.Create(&newItem)
			if err != nil {
				return err
			}
			newItems = append(newItems, newItem)
		}
		return nil
	})

	count := len(previousItems)
	message := "There was nothing to import"
	if count > 0 {
		message = fmt.Sprintf("Imported %s", pluralize(count, "item", "items"))
	}
	return message, newItems
}

func pluralize(count int, singular, plural string) string {
	word := plural
	if count == 1 {
		word = singular
	}
	return fmt.Sprintf("%d %s", count, word)
}
