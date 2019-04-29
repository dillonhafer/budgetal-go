package actions

import (
	"encoding/json"
	"fmt"

	"github.com/dillonhafer/budgetal/backend/models"
)

func (as *ActionSuite) Test_BudgetCategory_Import_Works() {
	user := as.CreateUser()
	// Setup previous budget
	oldBudget := models.Budget{Year: 2017, Month: 12, UserID: user.ID}
	oldBudget.FindOrCreate()
	oldCategory := models.BudgetCategory{}
	as.DB.BelongsTo(&oldBudget).First(&oldCategory)

	// 3 times do
	for i := 1; i <= 3; i++ {
		as.DB.Create(&models.BudgetItem{
			BudgetCategoryId: oldCategory.ID,
			Amount:           json.Number("10.00"),
			Name:             fmt.Sprintf("Savings %d", i),
		})
	}

	// Setup current budget
	b := models.Budget{Year: 2018, Month: 1, UserID: user.ID}
	b.FindOrCreate()
	category := models.BudgetCategory{}
	as.DB.BelongsTo(&b).Where("name = ?", oldCategory.Name).First(&category)

	// Pre-Assertions
	preTotal, _ := as.DB.Count(&models.BudgetItems{})
	as.Equal(3, preTotal)

	// Perform request
	r := as.AuthenticJSON(user, fmt.Sprintf("/budget-categories/%d/import", category.ID)).Post(map[string]string{})
	var rb struct {
		Message string `json:"message"`
	}
	json.NewDecoder(r.Body).Decode(&rb)

	// Post-Assertions
	as.Equal(200, r.Code)
	as.Equal("Imported 3 items", rb.Message)

	postTotal, _ := as.DB.Count(&models.BudgetItems{})
	as.Equal(6, postTotal)
}

func (as *ActionSuite) Test_BudgetCategory_Import_RequiresUser() {
	r := as.JSON("/budget-categories/1/import").Post(map[string]string{})
	as.Equal(401, r.Code)
}
