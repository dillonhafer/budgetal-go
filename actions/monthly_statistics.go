package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal/models"
	"github.com/fatih/color"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func MonthlyStatisticsShow(c buffalo.Context, currentUser *models.User) error {
	month, _ := strconv.ParseInt(c.Param("month"), 10, 64)
	year, _ := strconv.ParseInt(c.Param("year"), 10, 64)
	var params = struct {
		Month  int `db:"month"`
		Year   int `db:"year"`
		UserID int `db:"user_id"`
	}{
		int(month),
		int(year),
		currentUser.ID,
	}

	err := map[string]string{"budgetCategories": ""}
	type Category struct {
		Name        string `json:"name" db:"name"`
		AmountSpent string `json:"amountSpent" db:"amountSpent"`
	}
	var response struct {
		Categories []Category `json:"budgetCategories"`
	}
	response.Categories = []Category{}

	query := `
    select
      bc.name,
      coalesce(sum(bie.amount),0.00) as amountSpent
    from budgets b
      join budget_categories bc on bc.budget_id = b.id
      left join budget_items bi on bi.budget_category_id=bc.id
      left join budget_item_expenses bie on bie.budget_item_id=bi.id
    where b.month = :month
      and b.year = :year
      and b.user_id = :user_id
    group by bc.id;
  `
	c.Logger().Debug(color.YellowString(query))

	categories := []Category{}
	tx := c.Value("tx").(*pop.Connection)
	rows, dbErr := tx.TX.NamedQuery(query, params)
	if dbErr != nil {
		c.Logger().Debug(dbErr)
		return c.Render(200, r.JSON(err))
	}

	for rows.Next() {
		var cat Category
		rErr := rows.Scan(&cat.Name, &cat.AmountSpent)
		if rErr != nil {
			c.Logger().Debug(rErr)
			return c.Render(200, r.JSON(err))
		}
		categories = append(categories, cat)
	}

	response.Categories = categories

	return c.Render(200, r.JSON(response))
}
