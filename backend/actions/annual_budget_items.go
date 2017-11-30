package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
)

func AnnualBudgetItemsCreate(c buffalo.Context, currentUser *models.User) error {
	item := &models.AnnualBudgetItem{}
	if err := c.Bind(item); err != nil {
		return err
	}

	_, findErr := findAnnualBudget(item.AnnualBudgetID, currentUser.ID)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	createError := models.DB.Create(item)
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

	item := &models.AnnualBudgetItem{ID: id}
	findErr := findAnnualBudgetItem(item, currentUser.ID)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	params := &models.AnnualBudgetItem{}
	if err := c.Bind(params); err != nil {
		return err
	}

	updateError := item.Update(params)
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

	item := &models.AnnualBudgetItem{ID: id}
	findErr := findAnnualBudgetItem(item, currentUser.ID)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	deleteErr := models.DB.Destroy(item)
	if deleteErr != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findAnnualBudget(id, user_id int) (*models.AnnualBudget, error) {
	b := models.AnnualBudget{}
	err := models.DB.Where("user_id = ? and id = ?", user_id, id).First(&b)
	return &b, err
}

func findAnnualBudgetItem(i *models.AnnualBudgetItem, user_id int) error {
	q := `
		select annual_budget_items.*
		from annual_budget_items
		join annual_budgets on annual_budget_items.annual_budget_id = annual_budgets.id
		where annual_budgets.user_id = ?
		and annual_budget_items.id = ?
		limit 1
	`
	err := models.DB.RawQuery(q, user_id, i.ID).First(i)
	return err
}
