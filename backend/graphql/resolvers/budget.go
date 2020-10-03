package resolvers

import (
	"time"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// AllowedYear validates years
func AllowedYear(year int) bool {
	currentYear := time.Now().Local().Year()
	return year > 2014 && year < currentYear+4
}

// AllowedNetWorthYear validates net worth years
func AllowedNetWorthYear(year int) bool {
	return year > 1900 && year < 2100
}

// AllowedMonth validates calendar months
func AllowedMonth(month int) bool {
	return month > 0 && month < 13
}

// Budget resolve annual budgets
func Budget(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)

	year, yearOK := params.Args["year"].(int)
	month, monthOK := params.Args["month"].(int)

	if !yearOK || !monthOK || !AllowedMonth(month) || !AllowedYear(year) {
		return nil, nil
	}
	budget := models.Budget{
		UserID: currentUser.ID,
		Year:   year,
		Month:  month,
	}

	err := budget.FindOrCreate()
	if err != nil {
		return nil, nil
	}

	categories, items, expenses := budget.MonthlyView()
	for i, category := range categories {
		for _, item := range items {
			if item.BudgetCategoryId == category.ID {
				for _, expense := range expenses {
					if expense.BudgetItemId == item.ID {
						item.BudgetItemExpenses = append(item.BudgetItemExpenses, expense)
					}
				}
				categories[i].BudgetItems = append(categories[i].BudgetItems, item)
			}
		}
	}
	budget.BudgetCategories = categories

	return budget, nil
}
