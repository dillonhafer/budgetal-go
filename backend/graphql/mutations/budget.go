package mutations

import (
	"encoding/json"
	"strconv"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// BudgetIncomeUpdate will update the income for a budget
func BudgetIncomeUpdate(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)
	year, isOK := params.Args["year"].(int)
	if !isOK {
		return nil, nil
	}

	month, isOK := params.Args["month"].(int)
	if !isOK {
		return nil, nil
	}

	income, isOK := params.Args["income"].(float64)
	if !isOK {
		return nil, nil
	}

	budget := &models.Budget{}
	err := models.DB.Where(`
    user_id = ?
    and year = ?
    and month = ?
	`, currentUser.ID, year, month).First(budget)

	if err != nil {
		return nil, nil
	}

	budget.Income = json.Number(strconv.FormatFloat(income, 'f', -1, 64))
	err = models.DB.Update(budget)
	if err != nil {
		return nil, nil
	}

	return budget, nil
}
