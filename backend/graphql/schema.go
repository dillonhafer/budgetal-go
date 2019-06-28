package graphql

import (
	"github.com/dillonhafer/budgetal/backend/graphql/mutations"
	"github.com/dillonhafer/budgetal/backend/graphql/resolvers"
	"github.com/dillonhafer/budgetal/backend/graphql/types"
	"github.com/graphql-go/graphql"
)

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"annualBudget": &graphql.Field{
			Type:        types.AnnualBudget,
			Description: "Get the annual budget for a given year",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.AnnualBudget,
		},
		"budget": &graphql.Field{
			Type:        types.Budget,
			Description: "Get the budget for a given month",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"month": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.Budget,
		},
		"monthlyStatistic": &graphql.Field{
			Type:        graphql.NewList(types.MonthlyStatistic),
			Description: "Get the statistics of a budget for a given month",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"month": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.MonthlyStatistic,
		},
		"netWorth": &graphql.Field{
			Type:        graphql.NewList(types.NetWorth),
			Description: "Get the networth for a given year",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.NetWorth,
		},
		"assets": &graphql.Field{
			Type:        graphql.NewList(types.AssetLiability),
			Description: "Get the assets and liabilities for a user",
			Resolve:     resolvers.AssetsLiabilities,
		},
	},
})

var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"annualBudgetItemDelete": &graphql.Field{
			Type:        types.AnnualBudget,
			Description: "Deletes an annual budget item",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.AnnualBudgetItemDelete,
		},
		"annualBudgetItemUpsert": &graphql.Field{
			Type:        types.AnnualBudgetItem,
			Description: "Upserts an annual budget item",
			Args: graphql.FieldConfigArgument{
				"annualBudgetItemInput": &graphql.ArgumentConfig{
					Type: types.AnnualBudgetItemInput,
				},
			},
			Resolve: mutations.AnnualBudgetItemUpsert,
		},
	},
})

// BudgetalSchemaConfig for Budgetal
var BudgetalSchemaConfig = graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: rootMutation,
}
