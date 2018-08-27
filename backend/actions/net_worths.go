package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
)

// NetWorthsIndex returns assets and liabilties for a given year
func NetWorthsIndex(c buffalo.Context, currentUser *models.User) error {
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil || !AllowedNetWorthYear(year) {
		return c.Render(404, r.JSON("Not Found"))
	}

	var params = struct {
		Year   int
		UserID int
	}{
		year,
		currentUser.ID,
	}

	// Assets/Liabilities
	al := &models.AssetsLiabilities{}
	models.DB.Where("user_id = ?", params.UserID).All(al)
	assets, liabilities := al.Partition()

	// // Net Worth Items
	months := models.NetWorths{}
	models.DB.Where("user_id = ? and year = ?", currentUser.ID, year).All(&months)

	if len(months) == 0 {
		months.CreateYearTemplates(currentUser.ID, year)
	}

	response := map[string]interface{}{
		"assets":      assets,
		"liabilities": liabilities,
		"months":      months,
	}

	return c.Render(200, r.JSON(response))
}
