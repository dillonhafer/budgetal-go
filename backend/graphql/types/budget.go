package types

import (
	"github.com/graphql-go/graphql"
)

// Budget is the model type
var Budget = graphql.NewObject(graphql.ObjectConfig{
	Name: "Budget",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the budget",
		},
		"month": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Int),
			Description: "Calendar Month of the budget",
		},
		"year": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Int),
			Description: "Calendar Year of the budget",
		},
		"income": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Expected Income for the month",
		},
		"budgetCategories": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(BudgetCategory)),
		},
	},
})
