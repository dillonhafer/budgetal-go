package actions

import (
	"encoding/json"
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

// AnnualBudgetItemsCreate default implementation.
func AnnualBudgetItemsCreate(c buffalo.Context, currentUser *models.User) error {
	body := JsonMap(c)
	y := body["year"].(json.Number)
	year, err := strconv.Atoi(y.String())
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	budget, findErr := findAnnualBudget(year, currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	item := &models.AnnualBudgetItem{
		AnnualBudgetID: budget.ID,
	}
	name, ok := body["name"].(string)
	if ok {
		item.Name = name
	}

	amount, ok := body["amount"].(json.Number)
	if ok {
		item.Amount = amount
	}

	dueDate, ok := body["dueDate"].(string)
	if ok {
		item.DueDate = dueDate
	}

	paid, ok := body["paid"].(bool)
	if ok {
		item.Paid = paid
	}

	i := body["interval"].(json.Number)
	interval, err := strconv.Atoi(i.String())
	if err == nil {
		item.Interval = interval
	}

	createError := tx.Create(item)
	if createError != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.AnnualBudgetItem{"annualBudgetItem": item}))
}

func AnnualBudgetItemsUpdate(c buffalo.Context, currentUser *models.User) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	item, findErr := findAnnualBudgetItem(id, currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	body := JsonMap(c)
	name, ok := body["name"].(string)
	if ok {
		item.Name = name
	}

	amount, ok := body["amount"].(json.Number)
	if ok {
		item.Amount = amount
	}

	dueDate, ok := body["dueDate"].(string)
	if ok {
		item.DueDate = dueDate
	}

	paid, ok := body["paid"].(bool)
	if ok {
		item.Paid = paid
	}

	i := body["interval"].(json.Number)
	interval, err := strconv.Atoi(i.String())
	if err == nil {
		item.Interval = interval
	}

	updateError := tx.Update(item)
	if updateError != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.AnnualBudgetItem{
		"annualBudgetItem": item,
	}))
}

func AnnualBudgetItemsDelete(c buffalo.Context, currentUser *models.User) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}
	tx := c.Value("tx").(*pop.Connection)

	item, findErr := findAnnualBudgetItem(id, currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	deleteErr := tx.Destroy(item)
	if deleteErr != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findAnnualBudget(year, user_id int, tx *pop.Connection) (*models.AnnualBudget, error) {
	b := models.AnnualBudget{}
	err := tx.Where("user_id = ? and year = ?", user_id, year).First(&b)
	return &b, err
}

func findAnnualBudgetItem(id, user_id int, tx *pop.Connection) (*models.AnnualBudgetItem, error) {
	i := models.AnnualBudgetItem{}
	q := `
		select annual_budget_items.*
		from annual_budget_items
		join annual_budgets on annual_budget_items.annual_budget_id = annual_budgets.id
		where annual_budgets.user_id = ?
		and annual_budget_items.id = ?
		limit 1
	`
	err := tx.RawQuery(q, user_id, id).First(&i)
	return &i, err
}
