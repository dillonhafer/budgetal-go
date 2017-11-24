package models

import (
	"time"

	"github.com/markbates/pop"
)

type AnnualBudget struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"userId" db:"user_id"`
	Year      int       `json:"year" db:"year"`
	CreatedAt time.Time `json:"-" db:"created_at"`
	UpdatedAt time.Time `json:"-" db:"updated_at"`
}

type AnnualBudgets []AnnualBudget

func (ab *AnnualBudget) FindOrCreate(tx *pop.Connection) {
	err := tx.Where("user_id = ? and year = ?", ab.UserID, ab.Year).First(ab)
	if err != nil {
		err = tx.Create(ab)
		if err != nil {
		}
	}
}
