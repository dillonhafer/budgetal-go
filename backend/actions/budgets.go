package actions

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func BudgetsIndex(c buffalo.Context, currentUser *models.User) error {
	currentYear := time.Now().Local().Year()
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil || year > currentYear+3 || year < 2015 {
		return c.Render(404, r.JSON("Not Found"))
	}
	month, err := strconv.Atoi(c.Param("month"))
	if err != nil || month > 12 || month < 1 {
		return c.Render(404, r.JSON("Not Found"))
	}

	var params = struct {
		Year   int
		Month  int
		UserID int
	}{
		year,
		month,
		currentUser.ID,
	}
	tx := c.Value("tx").(*pop.Connection)

	budget := models.Budget{
		UserID: params.UserID,
		Year:   params.Year,
		Month:  params.Month,
	}
	err = budget.FindOrCreate(tx)
	if err != nil {
		return c.Render(422, r.JSON(err))
	}

	categories, items, expenses := budget.MonthlyView(tx)
	var response = struct {
		Budget             models.Budget             `json:"budget"`
		BudgetCategories   models.BudgetCategories   `json:"budgetCategories"`
		BudgetItems        models.BudgetItems        `json:"budgetItems"`
		BudgetItemExpenses models.BudgetItemExpenses `json:"budgetItemExpenses"`
	}{
		budget,
		categories,
		items,
		expenses,
	}

	return c.Render(200, r.JSON(response))
}

func BudgetsUpdate(c buffalo.Context, currentUser *models.User) error {
	currentYear := time.Now().Local().Year()
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil || year > currentYear+3 || year < 2015 {
		return c.Render(404, r.JSON("Not Found"))
	}
	month, err := strconv.Atoi(c.Param("month"))
	if err != nil || month > 12 || month < 1 {
		return c.Render(404, r.JSON("Not Found"))
	}
	income, ok := Json(c, "income").(string)
	if !ok {
		return c.Render(422, r.JSON("Invalid Income"))
	}

	var params = struct {
		Year   int
		Month  int
		UserID int
	}{
		year,
		month,
		currentUser.ID,
	}
	tx := c.Value("tx").(*pop.Connection)

	budget := &models.Budget{}
	err = tx.Where(`
    user_id = ?
    and year = ?
    and month = ?
  `, params.UserID, params.Year, params.Month).First(budget)
	if err != nil {
		return c.Render(404, r.JSON("Could not find budget"))
	}

	budget.Income = json.Number(income)
	err = tx.Update(budget)
	if err != nil {
		return c.Render(422, r.JSON("Could not update budget"))
	}

	return c.Render(200, r.JSON(budget))
}
