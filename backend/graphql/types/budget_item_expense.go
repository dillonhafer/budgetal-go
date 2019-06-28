package types

import (
	"github.com/graphql-go/graphql"
)

// BudgetItemExpense is the model type
var BudgetItemExpense = graphql.NewObject(graphql.ObjectConfig{
	Name: "BudgetItemExpense",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the expense",
		},
		"budgetItemId": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the item",
		},
		"name": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Name of the expense",
		},
		"amount": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Amount spent for this expense",
		},
		"date": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Date of the expense",
		},
	},
})
