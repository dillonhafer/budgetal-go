package actions

import (
	"context"
	"fmt"
	"log"

	schema "github.com/dillonhafer/budgetal/backend/graphql"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/graphql-go/graphql"
)

type graphqlParams struct {
	Query string `form:"query"`
}

// Graphql is The Graphql Endpoint
func Graphql(c buffalo.Context, currentUser *models.User) error {
	// Read POST body
	gp := &graphqlParams{}
	if err := c.Bind(gp); err != nil {
		return err
	}

	schema, err := graphql.NewSchema(schema.BudgetalSchemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	params := graphql.Params{
		Schema:        schema,
		RequestString: gp.Query,
		Context:       context.WithValue(context.Background(), "currentUser", currentUser),
	}

	response := graphql.Do(params)

	if len(response.Errors) > 0 {
		if ENV != "production" {
			err := fmt.Sprintf("failed to execute graphql operation, errors: %+v", response.Errors)
			return c.Render(200, r.JSON(err))
		}

		return c.Render(200, r.JSON(""))
	}

	return c.Render(200, r.JSON(response))
}
