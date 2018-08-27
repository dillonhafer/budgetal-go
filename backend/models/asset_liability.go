package models

import (
	"time"
)

// AssetLiability is a db model
type AssetLiability struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"userId" db:"user_id"`
	Name      string    `json:"name" db:"name"`
	IsAsset   bool      `json:"isAsset" db:"is_asset"`
	CreatedAt time.Time `json:"-" db:"created_at"`
	UpdatedAt time.Time `json:"-" db:"updated_at"`
}

// TableName overrides the table name used by Pop.
func (al AssetLiability) TableName() string {
	return "assets_liabilities"
}

// AssetsLiabilities is a slice of AssetLiability
type AssetsLiabilities []AssetLiability

// TableName overrides the table name used by Pop.
func (als AssetsLiabilities) TableName() string {
	return "assets_liabilities"
}

// Partition Takes a slice of assets and liabilities and partition them based on type
func (als *AssetsLiabilities) Partition() (AssetsLiabilities, AssetsLiabilities) {
	assets := AssetsLiabilities{}
	liabilities := AssetsLiabilities{}

	for _, al := range *als {
		if al.IsAsset {
			assets = append(assets, al)
		} else {
			liabilities = append(liabilities, al)
		}
	}
	return assets, liabilities
}
