package actions

import (
	"encoding/json"
	"time"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ActionSuite) Test_PastExpenses_Works() {
	user := SignedInUser(as)
	b := &models.Budget{Year: 2017, Month: 11, UserID: user.ID}
	b.FindOrCreate()
	category := &models.BudgetCategory{}
	as.DB.BelongsTo(b).First(category)

	i := &models.BudgetItem{
		BudgetCategoryId: category.ID,
		Amount:           json.Number("10.00"),
		Name:             "Savings",
	}
	as.DB.Create(i)
	as.DB.Create(&models.BudgetItemExpense{
		BudgetItemId: i.ID,
		Name:         "Kevin",
		Date:         time.Now(),
		Amount:       json.Number("8.00"),
	})
	as.DB.Create(&models.BudgetItemExpense{
		BudgetItemId: i.ID,
		Name:         "Test Expense",
		Date:         time.Now(),
		Amount:       json.Number("8.00"),
	})
	as.DB.Create(&models.BudgetItemExpense{
		BudgetItemId: i.ID,
		Name:         "test Expense 2",
		Date:         time.Now(),
		Amount:       json.Number("8.00"),
	})

	r := as.JSON("/past-expenses/tes").Get()
	var rb struct {
		Names []string `json:"names"`
	}
	json.NewDecoder(r.Body).Decode(&rb)

	as.Equal(200, r.Code)
	as.Equal(2, len(rb.Names))
}

func (as *ActionSuite) Test_PastExpenses_ReturnsEmptyArray() {
	user := SignedInUser(as)
	b := &models.Budget{Year: 2017, Month: 11, UserID: user.ID}
	b.FindOrCreate()
	category := &models.BudgetCategory{}
	as.DB.BelongsTo(b).First(category)

	i := &models.BudgetItem{
		BudgetCategoryId: category.ID,
		Amount:           json.Number("10.00"),
		Name:             "Savings",
	}
	as.DB.Create(i)

	r := as.JSON("/past-expenses/tes").Get()
	as.Equal(200, r.Code)
	as.Equal("{\"names\":[]}\n", r.Body.String())
}

func (as *ActionSuite) Test_PastExpenses_RequiresUser() {
	r := as.JSON("/past-expenses/tes").Get()
	as.Equal(401, r.Code)
}
