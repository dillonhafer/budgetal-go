package actions

import (
	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
)

func PastExpenses(c buffalo.Context, currentUser *models.User) error {
	name := c.Param("name") + "%"
	query := `
    select budget_item_expenses.name
    from budget_item_expenses
    join budget_items on budget_items.id = budget_item_expenses.budget_item_id
    join budget_categories on budget_categories.id = budget_items.budget_category_id
    join budgets on budgets.id = budget_categories.budget_id
    where budgets.user_id = ?
    and budget_item_expenses.name ilike ?
    group by budget_item_expenses.name
  `
	c.Logger().Debug(query)

	var names []string
	models.DB.RawQuery(query, currentUser.ID, name).All(&names)
	var response = struct {
		Names []string `json:"names"`
	}{
		names,
	}
	return c.Render(200, r.JSON(response))
}
