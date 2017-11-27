package actions

import (
	"encoding/json"
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func BudgetItemsCreate(c buffalo.Context, currentUser *models.User) error {
	body := JsonMap(c)
	cid := body["budgetCategoryId"].(json.Number)
	categoryID, err := strconv.Atoi(cid.String())
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// Find Category
	tx := c.Value("tx").(*pop.Connection)
	category, err := findBudgetCategory(categoryID, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	item := models.BudgetItem{
		BudgetCategoryId: category.ID,
	}

	// Create
	name, ok := body["name"].(string)
	if ok {
		item.Name = name
	}
	amount, ok := body["amount"].(json.Number)
	if ok {
		item.Amount = amount
	}
	tx.Create(&item)

	// render
	return c.Render(200, r.JSON(map[string]models.BudgetItem{
		"budgetItem": item,
	}))
}

func BudgetItemsUpdate(c buffalo.Context, currentUser *models.User) error {
	// find item
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	item, err := findBudgetItem(id, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// update
	body := JsonMap(c)
	name, ok := body["name"].(string)
	if ok {
		item.Name = name
	}
	amount, ok := body["amount"].(json.Number)
	if ok {
		item.Amount = amount
	}
	tx.Update(&item)

	// render
	return c.Render(200, r.JSON(map[string]models.BudgetItem{
		"budgetItem": item,
	}))
}

func BudgetItemsDelete(c buffalo.Context, currentUser *models.User) error {
	// find item
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	item, err := findBudgetItem(id, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// delete expenses
	expenseDeleteErrors := item.DestroyAllExpenses(tx, c.Logger())
	if expenseDeleteErrors != nil {
		return c.Render(422, r.JSON(map[string]bool{"ok": false}))
	}

	// delete item
	deleteErr := tx.Destroy(&item)
	if deleteErr != nil {
		return c.Render(422, r.JSON(map[string]bool{"ok": false}))
	}

	// render
	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findBudgetCategory(categoryID, userId int, tx *pop.Connection) (models.BudgetCategory, error) {
	c := models.BudgetCategory{}
	q := `
    select budget_categories.*
      from budget_categories
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_categories.id = ?
    limit 1
  `
	err := tx.RawQuery(q, userId, categoryID).First(&c)
	return c, err
}

func findBudgetItem(id, userId int, tx *pop.Connection) (models.BudgetItem, error) {
	i := models.BudgetItem{}
	q := `
    select
      budget_items.id,
      budget_items.budget_category_id,
      budget_items.name,
      budget_items.amount_budgeted,
      budget_items.created_at,
      budget_items.updated_at
    from budget_items
    join budget_categories on budget_categories.id=budget_items.budget_category_id
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_items.id = ?
    limit 1
  `
	err := tx.RawQuery(q, userId, id).First(&i)
	return i, err
}
