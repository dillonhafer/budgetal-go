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

// LoadItems loads all net worth items in one trip to the database, avoiding n+1 issues
func (nw *NetWorths) LoadItems() {
	netWorthIds := make([]interface{}, len(*nw))
	for i, n := range *nw {
		(*nw)[i].Items = NetWorthItems{}
		netWorthIds[i] = n.ID
	}
	items := &NetWorthItems{}
	DB.Where("net_worth_id in (?)", netWorthIds...).All(items)
	for _, item := range *items {
		for i, netWorth := range *nw {
			if netWorth.ID == item.NetWorthID {
				(*nw)[i].Items = append(netWorth.Items, item)
			}
		}
	}
}

// FindOrCreateYearTemplates finds or creates 12 months of net worths
func (nw *NetWorths) FindOrCreateYearTemplates(userID, year int) {
	*nw = nil
	DB.Where("user_id = ? and year = ?", userID, year).All(nw)

	if len(*nw) == 0 {
		nw.createYearTemplates(userID, year)
	}

	nw.LoadItems()
}
