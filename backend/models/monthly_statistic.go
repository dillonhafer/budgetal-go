package models

import (
	"sort"
)

// MonthlyStatistic is a db model
type MonthlyStatistic struct {
	ID           string `json:"id" db:"id"`
	UserID       int    `json:"-" db:"user_id"`
	Month        int    `json:"month" db:"month"`
	Year         int    `json:"year" db:"year"`
	Name         string `json:"name" db:"name"`
	AmountSpent  string `json:"amountSpent" db:"amount_spent"`
	TotalSpent   string `json:"totalSpent" db:"total_spent"`
	PercentSpent string `json:"percentSpent" db:"percent_spent"`
}

// FindMonthlyStatistics loads stats for a calendar month
func FindMonthlyStatistics(month, year, userID int) ([]MonthlyStatistic, error) {
	query := `
		select
			bc.id,
			b.user_id,
			b.month,
			b.year,
			bc.name,
			coalesce(sum(bie.amount),0.00) as amount_spent,
			sum(coalesce(sum(bie.amount),0.00)) OVER (partition by month, year) as total_spent,
			case
			when
				sum(coalesce(sum(bie.amount),0.00)) OVER (partition by month, year) = 0 then 0
			else
				round(
					(
						coalesce(sum(bie.amount),0.00)  /
						sum(coalesce(sum(bie.amount),0.00)) OVER (partition by month, year)
					) * 100
				)
			end as percent_spent
		from budgets b
			join budget_categories bc on bc.budget_id = b.id
			left join budget_items bi on bi.budget_category_id=bc.id
			left join budget_item_expenses bie on bie.budget_item_id=bi.id
		where b.month = ?
			and b.year = ?
			and b.user_id = ?
		group by user_id, month, year, bc.id
	`

	monthlyStatistics := []MonthlyStatistic{}
	err := DB.RawQuery(query, month, year, userID).All(&monthlyStatistics)
	if err != nil {
		return []MonthlyStatistic{}, nil
	}

	sort.Slice(monthlyStatistics, func(i, j int) bool {
		return CategorySortOrder[monthlyStatistics[i].Name] < CategorySortOrder[monthlyStatistics[i].Name]
	})

	return monthlyStatistics, nil
}
