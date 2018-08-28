package models_test

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ModelSuite) Test_NetWorthItem_Json() {
	m := &models.NetWorthItem{
		ID:               1,
		NetWorthID:       2,
		AssetLiabilityID: 3,
		Amount:           json.Number("34.32"),
	}
	b, _ := json.Marshal(m)
	netWorth := string(b)

	as.Contains(netWorth, `"id":1`)
	as.Contains(netWorth, `"netWorthId":2`)
	as.Contains(netWorth, `"assetId":3`)
	as.Contains(netWorth, `"amount":34.32`)
}

// func (as *ModelSuite) Test_FindNetWorthItemsByYear_CreatesNetWorths() {
// 	user := as.CreateUser(false)
// 	al := models.FindNetWorthItemsByYear(2018, user.ID)
// 	as.Len(al, 12)
// }
