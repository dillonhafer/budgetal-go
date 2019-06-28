package types

import (
	"github.com/graphql-go/graphql"
)

// AssetLiability is the model type
var AssetLiability = graphql.NewObject(graphql.ObjectConfig{
	Name: "AssetLiability",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the asset/liability",
		},
		"name": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "Name of the asset/liability",
		},
		"isAsset": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Boolean),
			Description: "Is this an asset instead of a liability?",
		},
	},
})
