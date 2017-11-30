package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func AnnualBudgetItemsCreate(c buffalo.Context, currentUser *models.User) error {
	item := &models.AnnualBudgetItem{}
	if err := c.Bind(item); err != nil {
		return err
	}

	tx := c.Value("tx").(*pop.Connection)
	_, findErr := findAnnualBudget(item.AnnualBudgetID, currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
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
	item := &models.AnnualBudgetItem{ID: id}
	findErr := findAnnualBudgetItem(item, currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	if err := c.Bind(item); err != nil {
		return err
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

	item := &models.AnnualBudgetItem{ID: id}
	findErr := findAnnualBudgetItem(item, currentUser.ID, tx)
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

func findAnnualBudget(id, user_id int, tx *pop.Connection) (*models.AnnualBudget, error) {
	b := models.AnnualBudget{}
	err := tx.Where("user_id = ? and id = ?", user_id, id).First(&b)
	return &b, err
}

func findAnnualBudgetItem(i *models.AnnualBudgetItem, user_id int, tx *pop.Connection) error {
	q := `
		select annual_budget_items.*
		from annual_budget_items
		join annual_budgets on annual_budget_items.annual_budget_id = annual_budgets.id
		where annual_budgets.user_id = ?
		and annual_budget_items.id = ?
		limit 1
	`
	err := tx.RawQuery(q, user_id, i.ID).First(i)
	return err
}
