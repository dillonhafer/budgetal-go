package types

import (
	"github.com/graphql-go/graphql"
)

// Message is the model type
var Message = graphql.NewObject(graphql.ObjectConfig{
	Name: "Message",
	Fields: graphql.Fields{
		"message": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Message",
		},
	},
})
