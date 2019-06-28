package types

import (
	"github.com/graphql-go/graphql"
)

// MonthlyStatistic is the model type
var MonthlyStatistic = graphql.NewObject(graphql.ObjectConfig{
	Name: "MonthlyStatistic",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the statistic",
		},
		"month": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Int),
			Description: "Calendar Month of the statistic",
		},
		"year": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Int),
			Description: "Calendar Year of the statistic",
		},
		"name": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Name of the budget category",
		},
		"amountSpent": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Amount spent in that category",
		},
	},
})
