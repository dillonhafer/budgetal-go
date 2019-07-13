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
		"currentUser": &graphql.Field{
			Type:        graphql.NewNonNull(types.User),
			Description: "Get the current logged in user",
			Resolve:     resolvers.CurrentUser,
		},
		"sessions": &graphql.Field{
			Type:        graphql.NewNonNull(types.Sessions),
			Description: "Get sessiosn for the current user",
			Resolve:     resolvers.Sessions,
		},
		"annualBudget": &graphql.Field{
			Type:        graphql.NewNonNull(types.AnnualBudget),
			Description: "Get the annual budget for a given year",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.AnnualBudget,
		},
		"budget": &graphql.Field{
			Type:        graphql.NewNonNull(types.Budget),
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
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(types.MonthlyStatistic))),
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
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(types.NetWorth))),
			Description: "Get the networth for a given year",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.NetWorth,
		},
		"assets": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(types.AssetLiability))),
			Description: "Get the assets and liabilities for a user",
			Resolve:     resolvers.AssetsLiabilities,
		},
	},
})

var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"budgetIncomeUpdate": &graphql.Field{
			Type:        graphql.NewNonNull(types.Budget),
			Description: "Update the income for a budget",
			Args: graphql.FieldConfigArgument{
				"month": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"income": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Float),
				},
			},
			Resolve: mutations.BudgetIncomeUpdate,
		},
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
		"budgetCategoryImport": &graphql.Field{
			Type:        graphql.NewNonNull(types.BudgetCategoryImport),
			Description: "Imports budget categories from a previous budget",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.BudgetCategoryImport,
		},
		"budgetItemDelete": &graphql.Field{
			Type:        graphql.NewNonNull(types.BudgetItem),
			Description: "Deletes a budget item",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.BudgetItemDelete,
		},
		"budgetItemUpsert": &graphql.Field{
			Type:        types.BudgetItem,
			Description: "Upserts a budget item",
			Args: graphql.FieldConfigArgument{
				"budgetItemInput": &graphql.ArgumentConfig{
					Type: types.BudgetItemInput,
				},
			},
			Resolve: mutations.BudgetItemUpsert,
		},
		"budgetItemExpenseDelete": &graphql.Field{
			Type:        graphql.NewNonNull(types.BudgetItemExpense),
			Description: "Deletes a budget item expense",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.BudgetItemExpenseDelete,
		},
		"budgetItemExpenseUpsert": &graphql.Field{
			Type:        graphql.NewNonNull(types.BudgetItemExpense),
			Description: "Upserts a budget item expense",
			Args: graphql.FieldConfigArgument{
				"budgetItemExpenseInput": &graphql.ArgumentConfig{
					Type: types.BudgetItemExpenseInput,
				},
			},
			Resolve: mutations.BudgetItemExpenseUpsert,
		},
		"signOut": &graphql.Field{
			Type:        types.User,
			Description: "Sign out the current user",
			Resolve:     mutations.SignOut,
		},
		"signIn": &graphql.Field{
			Type:        types.NewSession,
			Description: "Sign in",
			Args: graphql.FieldConfigArgument{
				"email": &graphql.ArgumentConfig{
					Description: "Email of user attempting to sign in",
					Type:        graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Description: "Password of user attempting to sign in",
					Type:        graphql.NewNonNull(graphql.String),
				},
				"deviceName": &graphql.ArgumentConfig{
					Description: "Device name for display in session",
					Type:        graphql.String,
				},
			},
			Resolve: mutations.SignIn,
		},
		"register": &graphql.Field{
			Type:        types.NewSession,
			Description: "Register",
			Args: graphql.FieldConfigArgument{
				"email": &graphql.ArgumentConfig{
					Description: "Email of user attempting to register",
					Type:        graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Description: "Password of user attempting to register",
					Type:        graphql.NewNonNull(graphql.String),
				},
				"deviceName": &graphql.ArgumentConfig{
					Description: "Device name for display in session",
					Type:        graphql.String,
				},
			},
			Resolve: mutations.Register,
		},
		"userUpdate": &graphql.Field{
			Type:        graphql.NewNonNull(types.User),
			Description: "Update the current user",
			Args: graphql.FieldConfigArgument{
				"userInput": &graphql.ArgumentConfig{
					Type: types.UserInput,
				},
				"file": &graphql.ArgumentConfig{
					Description: "New avatar for the current user",
					Type:        types.UploadType,
				},
			},
			Resolve: mutations.UserUpdate,
		},
		"userChangePassword": &graphql.Field{
			Type:        graphql.NewNonNull(types.User),
			Description: "Update the current user's password",
			Args: graphql.FieldConfigArgument{
				"password": &graphql.ArgumentConfig{
					Description: "New password",
					Type:        graphql.NewNonNull(graphql.String),
				},
				"currentPassword": &graphql.ArgumentConfig{
					Description: "Current password",
					Type:        graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: mutations.UserChangePassword,
		},
		"requestPasswordReset": &graphql.Field{
			Type:        graphql.NewNonNull(types.Message),
			Description: "Request a password reset email",
			Args: graphql.FieldConfigArgument{
				"email": &graphql.ArgumentConfig{
					Description: "Email to send reset instructions to",
					Type:        graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: mutations.RequestPasswordReset,
		},
		"resetPassword": &graphql.Field{
			Type:        graphql.NewNonNull(types.Message),
			Description: "Resset a password from an email",
			Args: graphql.FieldConfigArgument{
				"password": &graphql.ArgumentConfig{
					Description: "New password",
					Type:        graphql.NewNonNull(graphql.String),
				},
				"token": &graphql.ArgumentConfig{
					Description: "Token from email",
					Type:        graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: mutations.ResetPassword,
		},
		"sessionsDelete": &graphql.Field{
			Type:        types.Session,
			Description: "Deletes another session",
			Args: graphql.FieldConfigArgument{
				"authenticationKey": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.SessionDelete,
		},
		"updatePushNotificationToken": &graphql.Field{
			Type:        types.User,
			Description: "Update the sessions push notification token",
			Args: graphql.FieldConfigArgument{
				"token": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: mutations.UpdatePushNotificationToken,
		},
		"assetLiabilityUpsert": &graphql.Field{
			Type:        graphql.NewNonNull(types.AssetLiability),
			Description: "Upsert an asset/liability",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.ID,
				},
				"isAsset": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Boolean),
				},
				"name": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: mutations.AssetUpsert,
		},
		"assetLiabilityDelete": &graphql.Field{
			Type:        graphql.NewNonNull(types.AssetLiability),
			Description: "Deletes an asset/liability",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.AssetDelete,
		},
	},
})

// BudgetalSchemaConfig for Budgetal
var BudgetalSchemaConfig = graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: rootMutation,
}
