package types

import (
	"github.com/graphql-go/graphql"
)

// User is the model type
var User = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the User",
		},
		"email": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Email of user",
		},
		"firstName": &graphql.Field{
			Type:        graphql.String,
			Description: "First name of user",
		},
		"lastName": &graphql.Field{
			Type:        graphql.String,
			Description: "Last name of user",
		},
		"admin": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Boolean),
			Description: "Is user admin",
		},
		"avatarUrl": &graphql.Field{
			Type: graphql.String,
		},
	},
})

// UserInput is the params to upsert an annual budget item
var UserInput = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "UserInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"email": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"firstName": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"lastName": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"password": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
},
)
