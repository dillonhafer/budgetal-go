package mutations

import (
	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

// AllowedNetWorthYear validates net worth years
func AllowedNetWorthYear(year int) bool {
	return year > 1900 && year < 2100
}

// AllowedMonth validates calendar months
func AllowedMonth(month int) bool {
	return month > 0 && month < 13
}

// NetWorthItemImport will import items from a previous month
func NetWorthItemImport(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	year, isOK := params.Args["year"].(int)
	month, isOK := params.Args["month"].(int)

	if !isOK || !AllowedNetWorthYear(year) || !AllowedMonth(month) {
		return nil, nil
	}

	netWorth, err := findNetWorth(year, month, currentUser.ID)
	if err != nil {
		return nil, nil
	}

	message, _ := netWorth.ImportPreviousItems()
	netWorth.LoadItems()

	var resp = struct {
		Message       string           `json:"message"`
		NetWorthMonth *models.NetWorth `json:"netWorth"`
	}{
		message,
		netWorth,
	}

	println(len(netWorth.NetWorthItems))

	return resp, nil
}

func findNetWorth(year, month, userID int) (*models.NetWorth, error) {
	nw := models.NetWorth{}
	err := models.DB.Where("user_id = ? and year = ? and month = ?", userID, year, month).First(&nw)
	return &nw, err
}
