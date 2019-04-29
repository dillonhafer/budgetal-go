package models_test

import (
	"sort"

	"github.com/dillonhafer/budgetal/backend/models"
)

func (as *ModelSuite) Test_BudgetCategories_Sort() {
	categories := models.BudgetCategories([]models.BudgetCategory{
		{Name: "Saving"},
		{Name: "Housing"},
		{Name: "Utilities"},
		{Name: "Food"},
		{Name: "Clothing"},
		{Name: "Charity"},
		{Name: "Recreation"},
		{Name: "Medical/Health"},
		{Name: "Debts"},
		{Name: "Insurance"},
		{Name: "Personal"},
		{Name: "Transportation"},
	})
	sort.Sort(categories)

	as.Equal("Charity", categories[0].Name)
	as.Equal("Saving", categories[1].Name)
	as.Equal("Housing", categories[2].Name)
	as.Equal("Utilities", categories[3].Name)
	as.Equal("Food", categories[4].Name)
	as.Equal("Clothing", categories[5].Name)
	as.Equal("Transportation", categories[6].Name)
	as.Equal("Medical/Health", categories[7].Name)
	as.Equal("Insurance", categories[8].Name)
	as.Equal("Personal", categories[9].Name)
	as.Equal("Recreation", categories[10].Name)
	as.Equal("Debts", categories[11].Name)
}
