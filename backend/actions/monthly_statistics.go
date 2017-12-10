package actions

import (
	"sort"
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/fatih/color"
	"github.com/gobuffalo/buffalo"
)

type Category struct {
	Name        string `json:"name" db:"name"`
	AmountSpent string `json:"amountSpent" db:"amount_spent"`
}
type Categories []Category

func (s Categories) Len() int {
	return len(s)
}
func (s Categories) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s Categories) Less(i, j int) bool {
	return models.CategorySortOrder[s[i].Name] < models.CategorySortOrder[s[j].Name]
}

func MonthlyStatisticsShow(c buffalo.Context, currentUser *models.User) error {
	year, pErr := strconv.Atoi(c.Param("year"))
	if pErr != nil || !AllowedYear(year) {
		return c.Render(404, r.JSON("Not Found"))
	}
	month, pErr := strconv.Atoi(c.Param("month"))
	if pErr != nil || !AllowedMonth(month) {
		return c.Render(404, r.JSON("Not Found"))
	}

	var params = struct {
		Month  int `db:"month"`
		Year   int `db:"year"`
		UserID int `db:"user_id"`
	}{
		month,
		year,
		currentUser.ID,
	}

	err := map[string]string{"budgetCategories": ""}

	query := `
    select
      bc.name,
      coalesce(sum(bie.amount),0.00) as amount_spent
    from budgets b
      join budget_categories bc on bc.budget_id = b.id
      left join budget_items bi on bi.budget_category_id=bc.id
      left join budget_item_expenses bie on bie.budget_item_id=bi.id
    where b.month = ?
      and b.year = ?
      and b.user_id = ?
    group by bc.id
  `
	c.Logger().Debug(color.YellowString(query))
	categories := Categories{}
	dbErr := models.DB.RawQuery(query, params.Month, params.Year, params.UserID).All(&categories)
	sort.Sort(categories)

	if dbErr != nil {
		c.Logger().Debug(dbErr)
		return c.Render(500, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string][]Category{
		"budgetCategories": categories,
	}))
}
