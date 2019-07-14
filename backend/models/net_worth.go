package models

import (
	"fmt"
	"time"
)

// NetWorth db model
type NetWorth struct {
	ID            int           `json:"id" db:"id"`
	UserID        int           `json:"userId" db:"user_id"`
	Year          int           `json:"year" db:"year"`
	Month         int           `json:"month" db:"month"`
	Items         NetWorthItems `json:"items" fk_id:"net_worth_id" has_many:"net_worth_items"`
	NetWorthItems NetWorthItems `json:"-" db:"-"`
	CreatedAt     time.Time     `json:"-" db:"created_at"`
	UpdatedAt     time.Time     `json:"-" db:"updated_at"`
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

// LoadItems loads all net worth items for a single month
func (nw *NetWorth) LoadItems() {
	items := &NetWorthItems{}
	DB.Where("net_worth_id in (?)", nw.ID).All(items)
	nw.NetWorthItems = *items
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
			(*nw)[i].NetWorthItems = (*nw)[i].Items
		}
	}
}

// FindOrCreateYearTemplates finds or creates 12 months of net worths
func (nw *NetWorths) FindOrCreateYearTemplates(userID, year int) {
	*nw = nil
	DB.Where("user_id = ? and year = ?", userID, year).Order("month").All(nw)

	if len(*nw) == 0 {
		nw.createYearTemplates(userID, year)
	}

	nw.LoadItems()
}

func (nw *NetWorth) ImportPreviousItems() (string, NetWorthItems) {
	var previousMonth, previousYear int
	if nw.Month > 1 {
		previousMonth = nw.Month - 1
		previousYear = nw.Year
	} else {
		previousMonth = 12
		previousYear = nw.Year - 1
	}

	previousNetWorth := NetWorth{}
	DB.Where(`
		user_id = ? and year = ? and month = ?
	`, nw.UserID, previousYear, previousMonth).First(&previousNetWorth)

	previousItems := NetWorthItems{}
	DB.BelongsTo(&previousNetWorth).Order(`created_at`).All(&previousItems)

	// Transactionally import all items
	newItems := NetWorthItems{}
	for _, item := range previousItems {
		newItem := NetWorthItem{
			NetWorthID:       nw.ID,
			AssetLiabilityID: item.AssetLiabilityID,
			Amount:           item.Amount,
		}
		err := DB.Create(&newItem)
		if err != nil {
			continue
		}
		newItems = append(newItems, newItem)
	}

	count := len(newItems)
	message := "There was nothing to import"

	if count > 0 {
		message = fmt.Sprintf("Imported %s", pluralize(count, "item", "items"))
	}
	return message, newItems
}
