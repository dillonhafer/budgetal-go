package models_test

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal/backend/models"
)

func (as *ModelSuite) Test_NetWorth_Json() {
	u := &models.NetWorth{
		ID:    1,
		Year:  2018,
		Month: 8,
	}
	b, _ := json.Marshal(u)
	netWorth := string(b)

	as.Contains(netWorth, `"id":1`)
	as.Contains(netWorth, `"year":2018`)
	as.Contains(netWorth, `"month":8`)
}

func (as *ModelSuite) Test_FindOrCreateYearTemplates_CreatesNetWorths() {
	user := as.CreateUser(false)
	year := 2018

	count, _ := models.DB.Count(models.NetWorths{})
	as.Equal(0, count)

	nw := models.NetWorths{}
	nw.FindOrCreateYearTemplates(user.ID, year)

	count, _ = models.DB.Count(models.NetWorths{})
	as.Equal(12, count)
}

func (as *ModelSuite) Test_FindOrCreateYearTemplates_IsIdempotent() {
	user := as.CreateUser(false)
	year := 2018

	count, _ := models.DB.Count(models.NetWorths{})
	as.Equal(0, count)

	nw := models.NetWorths{}
	nw.FindOrCreateYearTemplates(user.ID, year)

	count, _ = models.DB.Count(models.NetWorths{})
	as.Equal(12, count)

	// It should remain 12
	nw.FindOrCreateYearTemplates(user.ID, year)
	count, _ = models.DB.Count(models.NetWorths{})
	as.Equal(12, count)
}

func (as *ModelSuite) Test_FindOrCreateYearTemplates_ReturnsItems() {
	user := as.CreateUser(false)
	year := 2018

	al := models.AssetLiability{UserID: user.ID, Name: "Home"}
	models.DB.Create(&al)

	nw := models.NetWorths{}
	nw.FindOrCreateYearTemplates(user.ID, year)

	count, _ := models.DB.Count(models.NetWorths{})
	as.Equal(12, count)

	jan := nw[0]
	models.DB.Create(&models.NetWorthItem{
		NetWorthID:       jan.ID,
		AssetLiabilityID: al.ID,
		Amount:           json.Number("100000.00"),
	})

	nw.FindOrCreateYearTemplates(user.ID, year)
	as.Equal(12, len(nw))

	as.Equal(1, len(nw[0].Items))

	as.Equal(al.ID, nw[0].Items[0].AssetLiabilityID)
}
