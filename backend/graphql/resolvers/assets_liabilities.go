package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// AssetsLiabilities resolve assets and liabilities
func AssetsLiabilities(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)

	assets := models.AssetsLiabilities{}
	models.DB.Where("user_id = ?", currentUser.ID).All(&assets)

	return assets, nil
}
