package models_test

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ModelSuite) Test_AssetLiability_Json() {
	m := &models.AssetLiability{
		ID:      1,
		UserID:  2,
		Name:    "Kevin",
		IsAsset: true,
	}
	b, _ := json.Marshal(m)
	netWorth := string(b)

	as.Contains(netWorth, `"id":1`)
	as.Contains(netWorth, `"userId":2`)
	as.Contains(netWorth, `"name":"Kevin"`)
}

func (as *ModelSuite) Test_AssetLiability_Partition() {
	m1 := models.AssetLiability{
		ID:      1,
		UserID:  2,
		Name:    "Kevin",
		IsAsset: true,
	}
	m2 := models.AssetLiability{
		ID:      2,
		UserID:  2,
		Name:    "Gru",
		IsAsset: false,
	}
	al := &models.AssetsLiabilities{m1, m2}
	assets, liabilities := al.Partition()

	// Test asset
	as.Len(assets, 1)
	as.True(assets[0].IsAsset)
	as.Equal(assets[0].Name, "Kevin")

	// Test liability
	as.Len(liabilities, 1)
	as.False(liabilities[0].IsAsset)
	as.Equal(liabilities[0].Name, "Gru")
}

func (as *ModelSuite) Test_AssetLiability_Partition_Empty() {
	al := &models.AssetsLiabilities{}
	assets, liabilities := al.Partition()
	as.Len(assets, 0)
	as.Len(liabilities, 0)
}
