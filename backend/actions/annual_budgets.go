package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
)

func AnnualBudgetsIndex(c buffalo.Context, currentUser *models.User) error {
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil || !AllowedYear(year) {
		return c.Render(404, r.JSON("Not Found"))
	}

	var params = struct {
		Year   int
		UserID int
	}{
		year,
		currentUser.ID,
	}

	annualBudget := models.AnnualBudget{UserID: params.UserID, Year: params.Year}
	annualBudgetItems := models.AnnualBudgetItems{}

	annualBudget.FindOrCreate()
	models.DB.BelongsTo(&annualBudget).Order(`name`).All(&annualBudgetItems)

	response := map[string]interface{}{
		"annualBudgetId":    annualBudget.ID,
		"annualBudgetItems": annualBudgetItems,
	}

	return c.Render(200, r.JSON(response))
}
