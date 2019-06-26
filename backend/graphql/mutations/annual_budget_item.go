package mutations

import (
	"encoding/json"
	"strconv"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

// AnnualBudgetItemDelete will delete an annaul budget item
func AnnualBudgetItemDelete(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)
	id, isOK := params.Args["id"].(int)
	if !isOK {
		return nil, nil
	}

	item := &models.AnnualBudgetItem{ID: id}
	findErr := findAnnualBudgetItem(item, currentUser.ID)
	if findErr != nil {
		return nil, nil
	}

	deleteErr := models.DB.Destroy(item)
	if deleteErr != nil {
		return nil, nil
	}

	annualBudget, findErr := findAnnualBudget(item.AnnualBudgetID, currentUser.ID)
	if findErr != nil {
		return nil, nil
	}

	return annualBudget, nil
}

type annualBudgetItemInput struct {
	ID             string  `mapstructure:"id"`
	AnnualBudgetID int     `mapstructure:"annualBudgetId"`
	Name           string  `mapstructure:"name"`
	Interval       int     `mapstructure:"interval"`
	DueDate        string  `mapstructure:"dueDate"`
	Amount         float64 `mapstructure:"amount"`
	Paid           bool    `mapstructure:"paid"`
}

// AnnualBudgetItemUpsert will insert or update an annual budget item
func AnnualBudgetItemUpsert(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)
	input := annualBudgetItemInput{}
	err := mapstructure.Decode(params.Args["annualBudgetItemInput"], &input)
	if err != nil {
		return nil, nil
	}

	budget, err := findAnnualBudget(input.AnnualBudgetID, currentUser.ID)
	if err != nil {
		return nil, nil
	}

	item := &models.AnnualBudgetItem{}
	id, err := strconv.Atoi(input.ID)
	if err == nil {
		item.ID = id
		err := findAnnualBudgetItem(item, currentUser.ID)
		if err != nil {
			return nil, nil
		}

		item.Name = input.Name
		item.Paid = input.Paid
		item.Interval = input.Interval
		item.Amount = json.Number(strconv.FormatFloat(input.Amount, 'e', -1, 64))
		item.DueDate = input.DueDate

		err = models.DB.Update(item)
		if err != nil {
			return nil, nil
		}
	} else {
		item.AnnualBudgetID = budget.ID
		item.Name = input.Name
		item.Paid = input.Paid
		item.Interval = input.Interval
		item.Amount = json.Number(strconv.FormatFloat(input.Amount, 'e', -1, 64))
		item.DueDate = input.DueDate
		err := models.DB.Create(item)
		if err != nil {
			return nil, nil
		}
	}

	return item, nil
}

func findAnnualBudgetItem(i *models.AnnualBudgetItem, userID int) error {
	q := `
		select annual_budget_items.*
		from annual_budget_items
		join annual_budgets on annual_budget_items.annual_budget_id = annual_budgets.id
		where annual_budgets.user_id = ?
		and annual_budget_items.id = ?
		limit 1
	`
	err := models.DB.RawQuery(q, userID, i.ID).First(i)
	return err
}

func findAnnualBudget(id, userID int) (*models.AnnualBudget, error) {
	b := models.AnnualBudget{}
	err := models.DB.Where("user_id = ? and id = ?", userID, id).First(&b)
	return &b, err
}
