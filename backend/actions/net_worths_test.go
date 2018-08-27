package actions

func (as *ActionSuite) Test_NetWorths_Index_RequiresUser() {
	r := as.JSON("/net-worths/2018").Get()
	as.Equal(401, r.Code)
}

// func (as *ActionSuite) Test_NetWorths_Index_Works() {
// 	user := as.SignedInUser()

// 	asset := models.AssetLiability{UserID: user.ID, Name: "Kevin", IsAsset: true}
// 	as.DB.Create(&asset)

// 	var resp struct {
// 		Assets      models.AssetsLiabilities `json:"assets"`
// 		Liabilities models.AssetsLiabilities `json:"liabilities"`
// 	}

// 	r := as.JSON("/net-worths/2018").Get()
// 	json.NewDecoder(r.Body).Decode(&resp)
// 	as.Equal(200, r.Code)
// 	as.Equal(1, len(resp.Assets))
// 	as.Equal(0, len(resp.Liabilities))
// }
