package types

import (
	"github.com/graphql-go/graphql"
)

// NetWorthItem is the model type
var NetWorthItem = graphql.NewObject(graphql.ObjectConfig{
	Name: "NetWorthItem",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the item",
		},
		"netWorthId": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the net worth",
		},
		"assetLiabilityId": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Name of the item",
		},
		"amount": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Amount budgeted for this item",
		},
		"asset": &graphql.Field{
			Type: graphql.NewNonNull(AssetLiability),
		},
	},
})
