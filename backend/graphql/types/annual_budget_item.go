package types

import (
	"github.com/graphql-go/graphql"
)

// AnnualBudgetItem is the model type
var AnnualBudgetItem = graphql.NewObject(graphql.ObjectConfig{
	Name: "AnnualBudgetItem",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"annualBudgetId": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"paid": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
		"interval": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"amount": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"dueDate": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"name": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
})

// AnnualBudgetItemInput is the params to upsert an annual budget item
var AnnualBudgetItemInput = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "AnnualBudgetItemInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"id": &graphql.InputObjectFieldConfig{
			Type: graphql.ID,
		},
		"annualBudgetId": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"paid": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
		"interval": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"amount": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Float),
		},
		"dueDate": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"name": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
},
)
