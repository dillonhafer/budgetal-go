package types

import (
	"github.com/graphql-go/graphql"
)

// NetWorth is the model type
var NetWorth = graphql.NewObject(graphql.ObjectConfig{
	Name: "NetWorth",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the NetWorth",
		},
		"month": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Int),
			Description: "Calendar Month of the NetWorth",
		},
		"year": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Int),
			Description: "Calendar Year of the NetWorth",
		},
		"netWorthItems": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(NetWorthItem))),
		},
	},
})
