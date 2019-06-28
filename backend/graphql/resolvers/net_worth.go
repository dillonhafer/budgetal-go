package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// NetWorth resolve annual budgets
func NetWorth(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)

	year, isOK := params.Args["year"].(int)
	if !isOK || !AllowedNetWorthYear(year) {
		return nil, nil
	}

	// Assets/Liabilities
	assets := models.AssetsLiabilities{}
	models.DB.Where("user_id = ?", currentUser.ID).All(&assets)
	// assets, liabilities := al.Partition()

	// // Net Worth Items
	months := models.NetWorths{}
	months.FindOrCreateYearTemplates(currentUser.ID, year)
	months.LoadItems()
	for i, netWorth := range months {
		for j, item := range netWorth.NetWorthItems {
			for _, asset := range assets {
				if item.AssetLiabilityID == asset.ID {
					months[i].NetWorthItems[j].Asset = asset
				}
			}
		}
	}

	return months, nil
}
