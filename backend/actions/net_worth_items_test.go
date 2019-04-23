package actions

import (
	"encoding/json"
	"fmt"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ActionSuite) Test_NetWorthsItems_Create_RequiresUser() {
	r := as.JSON("/net-worths/2018/08/net-worth-items").Post(&models.NetWorthItem{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_NetWorthItems_Create_Works() {
	bob, _, bobAsset, _, _, _ := setup(as)

	var resp struct {
		Item models.NetWorthItem `json:"item"`
	}
	r := as.AuthenticJSON(bob, "/net-worths/2018/08/net-worth-items").Post(
		map[string]interface{}{
			"assetId": bobAsset.ID,
			"amount":  json.Number("200.00"),
		})

	json.NewDecoder(r.Body).Decode(&resp)
	as.Equal(200, r.Code)
	as.Equal(json.Number("200.00"), resp.Item.Amount)
}

func (as *ActionSuite) Test_NetWorthItems_Create_VerifiesAssetID() {
	bob, _, _, aliceAsset, _, _ := setup(as)

	r := as.AuthenticJSON(bob, "/net-worths/2018/08/net-worth-items").Post(
		map[string]interface{}{
			"assetId": aliceAsset.ID,
			"amount":  json.Number("200.00"),
		})

	as.Equal(403, r.Code)
}

func (as *ActionSuite) Test_NetWorthItems_Update_Works() {
	bob, _, bobAsset, _, bobNetWorth, _ := setup(as)
	bobItem := models.NetWorthItem{
		NetWorthID:       bobNetWorth.ID,
		AssetLiabilityID: bobAsset.ID,
		Amount:           json.Number("200.00"),
	}
	models.DB.Create(&bobItem)

	var resp struct {
		Item models.NetWorthItem `json:"item"`
	}
	r := as.AuthenticJSON(bob, fmt.Sprintf("/net-worth-items/%d", bobItem.ID)).Patch(
		map[string]interface{}{
			"amount": json.Number("300.00"),
		})

	json.NewDecoder(r.Body).Decode(&resp)
	as.Equal(200, r.Code)
	as.Equal(json.Number("300.00"), resp.Item.Amount)
}

func (as *ActionSuite) Test_NetWorthItems_Update_VerifiesAssetID() {
	bob, _, _, aliceAsset, _, aliceNetWorth := setup(as)
	aliceItem := models.NetWorthItem{
		NetWorthID:       aliceNetWorth.ID,
		AssetLiabilityID: aliceAsset.ID,
		Amount:           json.Number("200.00"),
	}
	models.DB.Create(&aliceItem)

	r := as.AuthenticJSON(bob, fmt.Sprintf("/net-worth-items/%d", aliceItem.ID)).Patch(
		map[string]interface{}{
			"amount": json.Number("300.00"),
		})

	as.Equal(403, r.Code)
}

func (as *ActionSuite) Test_NetWorthItems_Delete_Works() {
	bob, _, bobAsset, _, bobNetWorth, _ := setup(as)
	bobItem := models.NetWorthItem{
		NetWorthID:       bobNetWorth.ID,
		AssetLiabilityID: bobAsset.ID,
		Amount:           json.Number("200.00"),
	}
	models.DB.Create(&bobItem)

	var resp struct {
		Ok bool `json:"ok"`
	}
	r := as.AuthenticJSON(bob, fmt.Sprintf("/net-worth-items/%d", bobItem.ID)).Delete()
	json.NewDecoder(r.Body).Decode(&resp)
	as.Equal(200, r.Code)
	as.Equal(true, resp.Ok)
}

func (as *ActionSuite) Test_NetWorthItems_Delete_VerifiesAssetID() {
	bob, _, _, aliceAsset, _, aliceNetWorth := setup(as)
	aliceItem := models.NetWorthItem{
		NetWorthID:       aliceNetWorth.ID,
		AssetLiabilityID: aliceAsset.ID,
		Amount:           json.Number("200.00"),
	}
	models.DB.Create(&aliceItem)

	var resp struct {
		Ok bool `json:"ok"`
	}
	r := as.AuthenticJSON(bob, fmt.Sprintf("/net-worth-items/%d", aliceItem.ID)).Delete()
	json.NewDecoder(r.Body).Decode(&resp)
	as.Equal(403, r.Code)
	as.Equal(false, resp.Ok)
}

func setup(as *ActionSuite) (bob, alice models.User, bobAsset, aliceAsset *models.AssetLiability, bobNetWorth, aliceNetWorth *models.NetWorth) {
	b := as.CreateUser()
	a := as.CreateUser()
	bob = b
	alice = a

	// Bob's items
	bobNetWorth = &models.NetWorth{
		UserID: bob.ID,
		Month:  8,
		Year:   2018,
	}
	models.DB.Create(bobNetWorth)
	bobAsset = &models.AssetLiability{
		UserID:  bob.ID,
		Name:    "Home",
		IsAsset: true,
	}
	models.DB.Create(bobAsset)

	// Alice's items
	aliceNetWorth = &models.NetWorth{
		UserID: alice.ID,
		Month:  8,
		Year:   2018,
	}
	models.DB.Create(aliceNetWorth)
	aliceAsset = &models.AssetLiability{
		UserID:  alice.ID,
		Name:    "Home",
		IsAsset: true,
	}
	models.DB.Create(aliceAsset)

	return bob, alice, bobAsset, aliceAsset, bobNetWorth, aliceNetWorth
}
