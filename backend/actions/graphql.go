package actions

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	graphqlContext "github.com/dillonhafer/budgetal/backend/context"
	schema "github.com/dillonhafer/budgetal/backend/graphql"
	"github.com/dillonhafer/budgetal/backend/graphql/mutations"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/graphql-go/graphql"
)

type graphqlParams struct {
	Query     string                 `form:"query"`
	Operation string                 `json:"operationName"`
	Variables map[string]interface{} `json:"variables"`
}

// Graphql is The Graphql Endpoint
func Graphql(c buffalo.Context) error {
	gp := bindGraphqlParams(c)
	ctx := newGraphqlContext(c)
	schema, err := graphql.NewSchema(schema.BudgetalSchemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	// Get params
	params := graphql.Params{
		Schema:         schema,
		RequestString:  gp.Query,
		VariableValues: gp.Variables,
		Context:        ctx,
	}

	response := graphql.Do(params)

	if response.HasErrors() {
		return handleGraphqlErrors(c, response)
	}

	return c.Render(200, r.JSON(response))
}

func getCurrentUser(AuthenticationKey, AuthenticationToken string) *models.User {
	session := &models.Session{}
	models.DB.Where("authentication_key = ? and authentication_token = ? and expired_at is null", AuthenticationKey, AuthenticationToken).First(session)
	currentUser := &models.User{}
	models.DB.Find(currentUser, session.UserID)
	currentUser.CurrentSession = session
	return currentUser
}

func getCurrentUserFromContext(c buffalo.Context) *models.User {
	AuthenticationKey, _ := c.Cookies().Get(mutations.AuthCookieKey)
	AuthenticationToken := c.Request().Header.Get(mutations.AuthHeaderKey)
	return getCurrentUser(AuthenticationKey, AuthenticationToken)
}

func bindGraphqlParams(c buffalo.Context) graphqlParams {
	c.Request().ParseMultipartForm(0)
	gp := graphqlParams{}
	BindParams(c, &gp)
	vars := c.Request().FormValue("variables")
	json.Unmarshal([]byte(vars), &gp.Variables)
	return gp
}

func newGraphqlContext(c buffalo.Context) context.Context {
	currentUser := getCurrentUserFromContext(c)
	ctx := context.WithValue(context.Background(), graphqlContext.BuffaloContextKey, c)
	if currentUser.ID != 0 {
		ctx = context.WithValue(ctx, graphqlContext.CurrentUserKey, currentUser)
	}

	file, _, fileErr := c.Request().FormFile("file")
	if fileErr == nil {
		ctx = context.WithValue(ctx, graphqlContext.FileUploadKey, file)
	}

	return ctx
}

func handleGraphqlErrors(c buffalo.Context, response *graphql.Result) error {
	if response.Errors[0].Message == "interface conversion: interface {} is nil, not *models.User" {
		return c.Render(401, r.JSON("You are not logged in"))
	}

	if ENV != "production" {
		err := fmt.Sprintf("Failed to execute graphql operation, errors: %+v", response.Errors)
		c.LogField("graphql errors", fmt.Sprintf("%#v", response.Errors))
		return c.Render(200, r.JSON(err))
	}

	return c.Render(200, r.JSON(""))
}
