package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
)

func BudgetsIndex(c buffalo.Context, currentUser *models.User) error {
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil || !AllowedYear(year) {
		return c.Render(404, r.JSON("Not Found"))
	}
	month, err := strconv.Atoi(c.Param("month"))
	if err != nil || !AllowedMonth(month) {
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

	budget := models.Budget{
		UserID: params.UserID,
		Year:   params.Year,
		Month:  params.Month,
	}
	err = budget.FindOrCreate()
	if err != nil {
		return c.Render(422, r.JSON(err))
	}

	categories, items, expenses := budget.MonthlyView()
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
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil || !AllowedYear(year) {
		return c.Render(404, r.JSON("Not Found"))
	}
	month, err := strconv.Atoi(c.Param("month"))
	if err != nil || !AllowedMonth(month) {
		return c.Render(404, r.JSON("Not Found"))
	}

	budgetParam := &models.Budget{}
	if err := c.Bind(budgetParam); err != nil {
		return err
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

	budget := &models.Budget{}
	err = models.DB.Where(`
    user_id = ?
    and year = ?
    and month = ?
  `, params.UserID, params.Year, params.Month).First(budget)
	if err != nil {
		return c.Render(404, r.JSON("Could not find budget"))
	}

	budget.Income = budgetParam.Income
	err = models.DB.Update(budget)
	if err != nil {
		return c.Render(422, r.JSON("Could not update budget"))
	}

	return c.Render(200, r.JSON(budget))
}
