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

// BudgetItemExpenseInput is the params to upsert a budget item expense
var BudgetItemExpenseInput = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "BudgetItemExpenseInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"id": &graphql.InputObjectFieldConfig{
			Type: graphql.ID,
		},
		"budgetItemId": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"amount": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Float),
		},
		"name": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"date": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
},
)
