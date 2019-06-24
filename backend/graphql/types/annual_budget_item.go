package types

import (
	"github.com/graphql-go/graphql"
)

// AnnualBudgetItem is the model type
var AnnualBudgetItem = graphql.NewObject(graphql.ObjectConfig{
	Name: "AnnualBudgetItem",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
		},
		"annualBudgetId": &graphql.Field{
			Type: graphql.String,
		},
		"paid": &graphql.Field{
			Type: graphql.Boolean,
		},
		"interval": &graphql.Field{
			Type: graphql.Int,
		},
		"amount": &graphql.Field{
			Type: graphql.Float,
		},
		"dueDate": &graphql.Field{
			Type: graphql.String,
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
	},
})
