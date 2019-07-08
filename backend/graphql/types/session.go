package types

import (
	"github.com/graphql-go/graphql"
)

// Sessions returns two kinds
var Sessions = graphql.NewObject(graphql.ObjectConfig{
	Name: "Sessions",
	Fields: graphql.Fields{
		"active": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(Session))),
			Description: "Active Sessions",
		},
		"expired": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(Session))),
			Description: "Expired Sessions",
		},
	},
})

// Session is the model type
var Session = graphql.NewObject(graphql.ObjectConfig{
	Name: "Session",
	Fields: graphql.Fields{
		"authenticationKey": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID of the session",
		},
		"userAgent": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "UserAgent of session when it started",
		},
		"ipAddress": &graphql.Field{
			Type:        graphql.String,
			Description: "IP address used when session started",
		},
		"deviceName": &graphql.Field{
			Type:        NullableString,
			Description: "Name of device session started on",
		},
		"createdAt": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.DateTime),
			Description: "Time session started",
		},
		"expiredAt": &graphql.Field{
			Type:        NullableTime,
			Description: "Time session ended",
		},
	},
})
