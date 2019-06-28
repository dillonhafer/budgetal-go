package types

import (
	"github.com/graphql-go/graphql"
)

// BudgetCategory is the model type
var BudgetCategory = graphql.NewObject(graphql.ObjectConfig{
	Name: "BudgetCategory",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the budget category",
		},
		"budgetId": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the budget",
		},
		"name": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Name of the category",
		},
		"percentage": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Recommended percentage that should be allocated in the budget",
		},
		"budgetItems": &graphql.Field{
			Type: graphql.NewList(BudgetItem),
		},
	},
})
