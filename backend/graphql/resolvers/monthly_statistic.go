package resolvers

import (
	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// MonthlyStatistic resolve annual MonthlyStatistics
func MonthlyStatistic(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)

	year, yearOK := params.Args["year"].(int)
	month, monthOK := params.Args["month"].(int)

	if !yearOK || !monthOK || !AllowedMonth(month) || !AllowedYear(year) {
		return nil, nil
	}

	monthlyStatistics, err := models.FindMonthlyStatistics(month, year, currentUser.ID)
	if err != nil {
		return nil, nil
	}

	return monthlyStatistics, nil
}
