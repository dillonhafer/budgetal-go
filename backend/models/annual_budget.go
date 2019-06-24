package models

import (
	"time"
)

type AnnualBudget struct {
	ID                int                `json:"id" db:"id"`
	UserID            int                `json:"userId" db:"user_id"`
	Year              int                `json:"year" db:"year"`
	CreatedAt         time.Time          `json:"-" db:"created_at"`
	UpdatedAt         time.Time          `json:"-" db:"updated_at"`
	AnnualBudgetItems []AnnualBudgetItem `json:"annualBudgetItems" db:"-"`
}

type AnnualBudgets []AnnualBudget

func (ab *AnnualBudget) FindOrCreate() {
	err := DB.Where("user_id = ? and year = ?", ab.UserID, ab.Year).First(ab)
	if err != nil {
		err = DB.Create(ab)
		if err != nil {
		}
	}
}
