package types

import (
	"github.com/graphql-go/graphql"
)

// AnnualBudget is the model type
var AnnualBudget = graphql.NewObject(graphql.ObjectConfig{
	Name: "AnnualBudget",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"year": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"annualBudgetItems": &graphql.Field{
			Type: graphql.NewList(AnnualBudgetItem),
		},
	},
})
