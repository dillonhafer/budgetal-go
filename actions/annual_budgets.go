package actions

import (
	"fmt"
	"strconv"

	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func AnnualBudgetsIndex(c buffalo.Context, currentUser *models.User) error {
	year, _ := strconv.ParseInt(c.Param("year"), 10, 64)
	var params = struct {
		Year   int
		UserID int
	}{
		int(year),
		currentUser.ID,
	}
	tx := c.Value("tx").(*pop.Connection)

	annualBudgetItems := findAnnualBudgetItems(tx, params.Year, params.UserID)
	return c.Render(200, r.JSON(map[string]*models.AnnualBudgetItems{"annualBudgetItems": annualBudgetItems}))
}

func findAnnualBudgetItems(tx *pop.Connection, year, user_id int) *models.AnnualBudgetItems {
	annualBudget := &models.AnnualBudget{UserID: user_id, Year: year}
	err := tx.Where("user_id = ? and year = ?", user_id, year).First(annualBudget)
	if err != nil {
		err = tx.Create(annualBudget)
		if err != nil {
			// log error
		}
	}

	println(fmt.Sprintf("%#v", annualBudget))

	annualBudgetItems := &models.AnnualBudgetItems{}
	err = tx.BelongsTo(annualBudget).All(annualBudgetItems)
	if err != nil {
		println(err)
		// log error
	}

	return annualBudgetItems
}
