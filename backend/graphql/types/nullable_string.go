package types

import (
	"github.com/gobuffalo/nulls"
	"github.com/graphql-go/graphql"
)

// NullableString represents buffalo's null type
var NullableString = graphql.NewScalar(graphql.ScalarConfig{
	Name:        "NullableString",
	Description: "Returns a string or null",
	Serialize: func(value interface{}) interface{} {
		switch value := value.(type) {
		case nulls.String:
			var v *string
			if value.Valid {
				v = &value.String
			}
			return v
		case *nulls.String:
			var v *string
			if value.Valid {
				v = &value.String
			}
			return v
		default:
			return nil
		}
	},
})
