package models

import (
	"time"
)

// NetWorth db model
type NetWorth struct {
	ID        int           `json:"id" db:"id"`
	UserID    int           `json:"userId" db:"user_id"`
	Year      int           `json:"year" db:"year"`
	Month     int           `json:"month" db:"month"`
	Items     NetWorthItems `json:"items" has_many:"net_worth_items"`
	CreatedAt time.Time     `json:"-" db:"created_at"`
	UpdatedAt time.Time     `json:"-" db:"updated_at"`
}

// NetWorths db model
type NetWorths []NetWorth

// CreateYearTemplates create 12 months of net worths
func (nw *NetWorths) CreateYearTemplates(userID, year int) {
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
