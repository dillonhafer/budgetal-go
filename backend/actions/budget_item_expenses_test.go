package actions

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/dillonhafer/budgetal/backend/models"
)

func (as *ActionSuite) Test_BudgetItemExpenses_Create_Works() {
	user := as.CreateUser()
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

	r := as.AuthenticJSON(user, "/budget-item-expenses").Post(map[string]interface{}{
		"budgetItemId": i.ID,
		"name":         "Account Transfer",
		"amount":       json.Number("200.00"),
		"date":         "2017-12-24",
	})
	var rb struct {
		BudgetItemExpense models.BudgetItemExpense `json:"budgetItemExpense"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.NotEmpty(rb.BudgetItemExpense.ID)
	as.Equal("Account Transfer", rb.BudgetItemExpense.Name)
	as.Equal("200.00", rb.BudgetItemExpense.Amount.String())
	as.Equal("2017-12-24", rb.BudgetItemExpense.Date.Format("2006-01-02"))
}

func (as *ActionSuite) Test_BudgetItemExpenses_Update_Works() {
	user := as.CreateUser()
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
	e := &models.BudgetItemExpense{
		BudgetItemId: i.ID,
		Name:         "Account Transfer",
		Date:         time.Now(),
		Amount:       json.Number("8.00"),
	}
	as.DB.Create(e)

	r := as.AuthenticJSON(user, fmt.Sprintf("/budget-item-expenses/%d", e.ID)).Put(map[string]interface{}{
		"budgetItemId": i.ID,
		"name":         "Account Withdraw",
		"amount":       json.Number("200.00"),
		"date":         "2017-12-24",
	})
	var rb struct {
		BudgetItemExpense *models.BudgetItemExpense `json:"budgetItemExpense"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.Equal(e.ID, rb.BudgetItemExpense.ID)
	as.Equal("Account Withdraw", rb.BudgetItemExpense.Name)
	as.Equal("200.00", rb.BudgetItemExpense.Amount.String())
	as.Equal("2017-12-24", rb.BudgetItemExpense.Date.Format("2006-01-02"))

	all := models.BudgetItems{}
	total, _ := as.DB.Count(&all)
	as.Equal(1, total)
}

func (as *ActionSuite) Test_BudgetItemExpenses_Delete_Works() {
	user := as.CreateUser()
	b := models.Budget{Year: 2017, Month: 11, UserID: user.ID}
	b.FindOrCreate()
	category := models.BudgetCategory{}
	as.DB.BelongsTo(&b).First(&category)

	i := models.BudgetItem{
		BudgetCategoryId: category.ID,
		Amount:           json.Number("10.00"),
		Name:             "Savings",
	}
	as.DB.Create(&i)
	e := models.BudgetItemExpense{
		BudgetItemId: i.ID,
		Name:         "Account Transfer",
		Date:         time.Now(),
		Amount:       json.Number("8.00"),
	}
	as.DB.Create(&e)

	beforeTotal, _ := as.DB.Count(&models.BudgetItemExpense{})
	as.Equal(1, beforeTotal)

	r := as.AuthenticJSON(user, fmt.Sprintf("/budget-item-expenses/%d", e.ID)).Delete()
	as.Equal(200, r.Code)

	afterTotal, _ := as.DB.Count(&models.BudgetItemExpense{})
	as.Equal(0, afterTotal)
}

func (as *ActionSuite) Test_BudgetItemExpenses_Create_RequiresUser() {
	r := as.JSON("/budget-item-expenses").Post(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_BudgetItemExpenses_Update_RequiresUser() {
	r := as.JSON("/budget-item-expenses/1").Put(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_BudgetItemExpenses_Delete_RequiresUser() {
	r := as.JSON("/budget-item-expenses/1").Delete()
	as.Equal(401, r.Code)
}
