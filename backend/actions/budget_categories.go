package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo"
)

func BudgetCategoryImport(c buffalo.Context, currentUser *models.User) error {
	categoryID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	category, err := findBudgetCategory(categoryID, currentUser.ID)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	message, items := category.ImportPreviousItems()
	var resp = struct {
		Message     string             `json:"message"`
		BudgetItems models.BudgetItems `json:"budgetItems"`
	}{
		message,
		items,
	}
	return c.Render(200, r.JSON(resp))
}
