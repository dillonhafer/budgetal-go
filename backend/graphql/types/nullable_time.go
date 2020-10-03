package types

import (
	"time"

	"github.com/gobuffalo/nulls"
	"github.com/graphql-go/graphql"
)

// NullableTime represents buffalo's null type
var NullableTime = graphql.NewScalar(graphql.ScalarConfig{
	Name:        "NullableTime",
	Description: "Returns a string or null",
	Serialize: func(value interface{}) interface{} {
		switch value := value.(type) {
		case nulls.Time:
			var v *time.Time
			if value.Valid {
				v = &value.Time
			}
			return v
		case *nulls.Time:
			var v *time.Time
			if value.Valid {
				v = &value.Time
			}
			return v
		default:
			return nil
		}
	},
})