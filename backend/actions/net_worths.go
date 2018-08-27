package actions

import (
	"encoding/json"
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
)

type Item struct {
	ID      int         `json:"id"`
	AssetID int         `json:"assetId"`
	IsAsset bool        `json:"isAsset"`
	Amount  json.Number `json:"amount"`
}

type Month struct {
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Items []Item `json:"items"`
}

type Months []Month

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
	// netWorth := models.NetWorthItem.FindOrCreate{UserID: params.UserID, Year: params.Year}
	months := Months{}

	for m := 1; m <= 12; m++ {
		month := Month{
			year,
			m,
			[]Item{
				Item{ID: 1, AssetID: 1, IsAsset: true, Amount: json.Number("5388.33")},
				Item{ID: 2, AssetID: 2, IsAsset: true, Amount: json.Number("1200.00")},
				Item{ID: 3, AssetID: 4, IsAsset: true, Amount: json.Number("30828.00")},
			},
		}
		months = append(months, month)
	}

	response := map[string]interface{}{
		"assets":      assets,
		"liabilities": liabilities,
		"months":      months,
	}

	return c.Render(200, r.JSON(response))
}
