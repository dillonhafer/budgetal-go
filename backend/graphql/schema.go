package graphql

import (
	"github.com/dillonhafer/budgetal/backend/graphql/resolvers"
	"github.com/dillonhafer/budgetal/backend/graphql/types"
	"github.com/graphql-go/graphql"
)

var fields = graphql.Fields{
	"annualBudget": &graphql.Field{
		Type:        types.AnnualBudget,
		Description: "Get the annual budget for a given year",
		Args: graphql.FieldConfigArgument{
			"year": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: resolvers.AnnualBudget,
	},
}

// RootQuery for Budgetal
var RootQuery = graphql.ObjectConfig{Name: "BudgetalSchema", Fields: fields}
