package types

import (
	"time"

	"github.com/graphql-go/graphql"
)

// Date represents a date without time
var Date = graphql.NewScalar(graphql.ScalarConfig{
	Name:        "Date",
	Description: "Returns a Date (e.g. 2006-01-02)",
	Serialize: func(value interface{}) interface{} {
		switch value := value.(type) {
		case string:
			if len(value) > 9 {
				return value[0:10]
			}
			return value
		case time.Time:
			return value.Format("2006-01-02")
		case *time.Time:
			return value.Format("2006-01-02")
		default:
			return nil
		}
	},
})
