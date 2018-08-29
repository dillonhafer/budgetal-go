package models

import (
	"time"

	"github.com/dillonhafer/coke/models"
)

// NetWorth db model
type NetWorth struct {
	ID        int           `json:"id" db:"id"`
	UserID    int           `json:"userId" db:"user_id"`
	Year      int           `json:"year" db:"year"`
	Month     int           `json:"month" db:"month"`
	Items     NetWorthItems `json:"items" fk_id:"net_worth_id" has_many:"net_worth_items"`
	CreatedAt time.Time     `json:"-" db:"created_at"`
	UpdatedAt time.Time     `json:"-" db:"updated_at"`
}

// NetWorths db model
type NetWorths []NetWorth

func (nw *NetWorths) createYearTemplates(userID, year int) {

	for m := 1; m <= 12; m++ {
		month := NetWorth{
			UserID: userID,
			Year:   year,
			Month:  m,
		}
		DB.Create(&month)
		*nw = append(*nw, month)
	}
}

// FindOrCreateYearTemplates finds or creates 12 months of net worths
func (nw *NetWorths) FindOrCreateYearTemplates(userID, year int) {
	*nw = nil
	models.DB.Where("user_id = ? and year = ?", userID, year).All(nw)

	if len(*nw) == 0 {
		nw.createYearTemplates(userID, year)
	}

	models.DB.Load(nw, "Items")
}
