package actions

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func BudgetItemsCreate(c buffalo.Context, currentUser *models.User) error {
	return nil
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

	// delete
	tx.Destroy(&item)

	// render
	return c.Render(200, r.JSON(""))
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
	println(fmt.Sprintf("DB ERROR: %#v", err))
	return i, err
}
