package models

import (
	"encoding/json"
	"time"
)

// NetWorthItem is a db model
type NetWorthItem struct {
	ID               int         `json:"id" db:"id"`
	NetWorthID       int         `json:"netWorthId" db:"net_worth_id"`
	AssetLiabilityID int         `json:"assetLiabilityId" db:"asset_liability_id"`
	Amount           json.Number `json:"amount" db:"amount"`
	CreatedAt        time.Time   `json:"-" db:"created_at"`
	UpdatedAt        time.Time   `json:"-" db:"updated_at"`
}

// NetWorthItems is a slice of NetWorthItem
type NetWorthItems []NetWorthItem

type NetWorthItemGraph struct {
	ID               int         `json:"id" db:"id"`
	NetWorthID       int         `json:"netWorthId" db:"net_worth_id"`
	AssetLiabilityID int         `json:"assetLiabilityId" db:"asset_liability_id"`
	Amount           json.Number `json:"amount" db:"amount"`
	CreatedAt        time.Time   `json:"-" db:"created_at"`
	UpdatedAt        time.Time   `json:"-" db:"updated_at"`
}

// FindNetWorthItemsByYear returns formatted data structure for API
func FindNetWorthItemsByYear(year, userID int) []NetWorthItemGraph {
	sql := `select net_worth_items.id, asset_liability_id, amount, is_asset, year, month
from net_worth_items 
join assets_liabilities on assets_liabilities.id= net_worth_items.asset_liability_id
join net_worths on net_worths.id = net_worth_items.net_worth_id
where net_worths.user_id = ?
and net_worths.year = ?
`

	graph := []NetWorthItemGraph{}
	DB.Where(sql, userID, year).All(&graph)

	if len(graph) == 0 {

	}

	return graph
}
