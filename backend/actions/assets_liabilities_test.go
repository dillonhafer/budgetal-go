package actions

import (
	"encoding/json"
	"fmt"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ActionSuite) Test_AssetsLiabilities_Create_RequiresUser() {
	r := as.JSON("/assets-liabilities").Post(models.AssetLiability{
		Name:    "Home",
		IsAsset: true,
	})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_AssetsLiabilities_Create_Works() {
	SignedInUser(as)

	r := as.JSON("/assets-liabilities").Post(models.AssetLiability{
		Name:    "Home",
		IsAsset: true,
	})
	var rb struct {
		AssetLiability models.AssetLiability `json:"assetLiability"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.Equal("Home", rb.AssetLiability.Name)
	as.Equal(true, rb.AssetLiability.IsAsset)

	count, _ := models.DB.Count(models.AssetLiability{})
	as.Equal(1, count)
}

func (as *ActionSuite) Test_AssetsLiabilities_Update_RequiresUser() {
	r := as.JSON(fmt.Sprintf("/assets-liabilities/%d", 1)).Patch(models.AssetLiability{
		Name: "Our Home",
	})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_AssetsLiabilities_Update_Works() {
	user := as.SignedInUser()
	al := &models.AssetLiability{
		UserID:  user.ID,
		Name:    "Home",
		IsAsset: true,
	}
	models.DB.Create(al)

	// Expect there to be an asset
	count, _ := models.DB.Count(models.AssetLiability{})
	as.Equal(1, count)

	// Update Asset
	r := as.JSON(fmt.Sprintf("/assets-liabilities/%d", al.ID)).Patch(models.AssetLiability{
		Name: "Our Home",
	})
	var rb struct {
		AssetLiability models.AssetLiability `json:"assetLiability"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.Equal("Our Home", rb.AssetLiability.Name)
	as.Equal(true, rb.AssetLiability.IsAsset)
}

func (as *ActionSuite) Test_AssetsLiabilities_Delete_Works() {
	user := as.SignedInUser()
	al := &models.AssetLiability{
		UserID:  user.ID,
		Name:    "Home",
		IsAsset: true,
	}
	models.DB.Create(al)

	// Expect there to be an asset
	count, _ := models.DB.Count(models.AssetLiability{})
	as.Equal(1, count)

	// Update Asset
	r := as.JSON(fmt.Sprintf("/assets-liabilities/%d", al.ID)).Delete()
	var rb struct {
		Ok bool `json:"ok"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.Equal(true, rb.Ok)

	// Expect there to be an asset
	count, _ = models.DB.Count(models.AssetLiability{})
	as.Equal(0, count)
}

func (as *ActionSuite) Test_AssetsLiabilities_Delete_RequiresUser() {
	r := as.JSON("/assets-liabilities/1").Delete()
	as.Equal(401, r.Code)
}
