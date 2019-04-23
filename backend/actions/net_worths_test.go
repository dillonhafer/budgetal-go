package actions

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ActionSuite) Test_NetWorths_Index_RequiresUser() {
	r := as.JSON("/net-worths/2018").Get()
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_NetWorths_Index_Works() {
	user := as.CreateUser()

	asset := models.AssetLiability{UserID: user.ID, Name: "Kevin", IsAsset: true}
	models.DB.Create(&asset)

	var resp struct {
		Assets      models.AssetsLiabilities `json:"assets"`
		Liabilities models.AssetsLiabilities `json:"liabilities"`
		Months      models.NetWorths         `json:"months"`
	}

	r := as.AuthenticJSON(user, "/net-worths/2018").Get()
	json.NewDecoder(r.Body).Decode(&resp)
	as.Equal(200, r.Code)
	as.Equal(1, len(resp.Assets))
	as.Equal(0, len(resp.Liabilities))
	as.Equal(12, len(resp.Months))
}

func (as *ActionSuite) Test_NetWorth_Import_Works() {
	user := as.CreateUser()

	// Assets and Liabilities
	asset := models.AssetLiability{
		UserID:  user.ID,
		Name:    "My Asset",
		IsAsset: true,
	}
	liability := models.AssetLiability{
		UserID:  user.ID,
		Name:    "My Liability",
		IsAsset: false,
	}
	err := models.DB.Create(&asset)
	as.Equal(nil, err)

	err = models.DB.Create(&liability)
	as.Equal(nil, err)

	// Setup previous budget
	oldNetWorth := models.NetWorth{Year: 2017, Month: 12, UserID: user.ID}
	err = models.DB.Create(&oldNetWorth)
	as.Equal(nil, err)

	// Setup 2 old items
	err = models.DB.Create(&models.NetWorthItem{
		NetWorthID:       oldNetWorth.ID,
		AssetLiabilityID: asset.ID,
		Amount:           json.Number("10.00"),
	})
	as.Equal(nil, err)
	err = models.DB.Create(&models.NetWorthItem{
		NetWorthID:       oldNetWorth.ID,
		AssetLiabilityID: liability.ID,
		Amount:           json.Number("5.00"),
	})
	as.Equal(nil, err)

	// Setup current net worth
	rg := as.AuthenticJSON(user, "/net-worths/2018").Get()
	as.Equal(200, rg.Code)

	// Pre-Assertions
	ALpreTotal, _ := models.DB.Count(&models.AssetsLiabilities{})
	as.Equal(2, ALpreTotal)

	NWpreTotal, _ := models.DB.Count(&models.NetWorths{})
	as.Equal(13, NWpreTotal)

	preTotal, _ := models.DB.Count(&models.NetWorthItems{})
	as.Equal(2, preTotal)

	// Perform request
	resp := as.AuthenticJSON(user, "/net-worths/2018/1/import").Post(map[string]string{})
	as.Equal(200, resp.Code)

	var rb struct {
		Items   models.NetWorthItems `json:"items"`
		Message string               `json:"message"`
	}
	json.NewDecoder(resp.Body).Decode(&rb)

	// Post-Assertions
	as.Equal("Imported 2 items", rb.Message)

	postTotal, _ := models.DB.Count(&models.NetWorthItems{})
	as.Equal(4, postTotal)
	as.Equal(2, len(rb.Items))
}

func (as *ActionSuite) Test_NetWorths_Import_RequiresUser() {
	r := as.JSON("/net-worths/2018/1/import").Post(map[string]string{})
	as.Equal(401, r.Code)
}
