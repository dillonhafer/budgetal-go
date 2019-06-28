package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// AssetsLiabilities resolve assets and liabilities
func AssetsLiabilities(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)

	assets := models.AssetsLiabilities{}
	models.DB.Where("user_id = ?", currentUser.ID).All(&assets)

	return assets, nil
}
