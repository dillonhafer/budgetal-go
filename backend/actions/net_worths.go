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
	months.FindOrCreateYearTemplates(currentUser.ID, year)

	response := map[string]interface{}{
		"assets":      assets,
		"liabilities": liabilities,
		"months":      months,
	}

	return c.Render(200, r.JSON(response))
}

// NetWorthsImport creates and returns net worth items from a previous month for the current one
func NetWorthsImport(c buffalo.Context, currentUser *models.User) error {
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil || !AllowedNetWorthYear(year) {
		return c.Render(404, r.JSON("Not Found"))
	}
	month, err := strconv.Atoi(c.Param("month"))
	if err != nil || !AllowedMonth(month) {
		return c.Render(404, r.JSON("Not Found"))
	}

	var params = struct {
		Year  int
		Month int
	}{
		year,
		month,
	}

	netWorth, err := findNetWorth(params.Year, params.Month, currentUser.ID)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	message, items := netWorth.ImportPreviousItems()
	var resp = struct {
		Message string               `json:"message"`
		Items   models.NetWorthItems `json:"items"`
	}{
		message,
		items,
	}
	return c.Render(200, r.JSON(resp))
}

func findNetWorth(year, month, userID int) (*models.NetWorth, error) {
	nw := models.NetWorth{}
	err := models.DB.Where("user_id = ? and year = ? and month = ?", userID, year, month).First(&nw)
	return &nw, err
}
