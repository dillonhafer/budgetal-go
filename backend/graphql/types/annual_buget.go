package types

import (
	"github.com/graphql-go/graphql"
)

// AnnualBudget is the model type
var AnnualBudget = graphql.NewObject(graphql.ObjectConfig{
	Name: "AnnualBudget",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
		},
		"year": &graphql.Field{
			Type: graphql.String,
		},
		"name": &graphql.Field{
			Type: graphql.Boolean,
		},
		"annualBudgetItems": &graphql.Field{
			Type: graphql.NewList(AnnualBudgetItem),
		},
	},
})
