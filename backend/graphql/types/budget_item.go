package types

import (
	"github.com/graphql-go/graphql"
)

// BudgetItem is the model type
var BudgetItem = graphql.NewObject(graphql.ObjectConfig{
	Name: "BudgetItem",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the item",
		},
		"budgetCategoryId": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the category",
		},
		"name": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Name of the item",
		},
		"amount": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Amount budgeted for this item",
		},
		"budgetItemExpenses": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(BudgetItemExpense))),
		},
	},
})

// BudgetItemInput is the params to upsert a budget item
var BudgetItemInput = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "BudgetItemInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"id": &graphql.InputObjectFieldConfig{
			Type: graphql.ID,
		},
		"budgetCategoryId": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"amount": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Float),
		},
		"name": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
},
)
