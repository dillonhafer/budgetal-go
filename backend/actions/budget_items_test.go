package actions

import (
	"encoding/json"
	"fmt"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ActionSuite) Test_BudgetItems_Create_Works() {
	user := SignedInUser(as)
	b := models.Budget{Year: 2017, Month: 11, UserID: user.ID}
	b.FindOrCreate(as.DB)
	category := models.BudgetCategory{}
	as.DB.BelongsTo(&b).First(&category)

	r := as.JSON("/budget-items").Post(map[string]interface{}{
		"budgetCategoryId": category.ID,
		"name":             "Life Insurance",
		"amount":           json.Number("200.00"),
	})
	var rb struct {
		BudgetItem models.BudgetItem `json:"budgetItem"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.NotEmpty(rb.BudgetItem.ID)
	as.Equal("Life Insurance", rb.BudgetItem.Name)
	as.Equal("200.00", rb.BudgetItem.Amount.String())

	all := models.BudgetItems{}
	total, _ := as.DB.Count(&all)
	as.Equal(1, total)
}

func (as *ActionSuite) Test_BudgetItems_Update_Works() {
	user := SignedInUser(as)
	b := models.Budget{Year: 2017, Month: 11, UserID: user.ID}
	b.FindOrCreate(as.DB)
	category := models.BudgetCategory{}
	as.DB.BelongsTo(&b).First(&category)

	i := models.BudgetItem{
		BudgetCategoryId: category.ID,
		Amount:           json.Number("10.00"),
		Name:             "Savings",
	}
	as.DB.Create(&i)

	r := as.JSON(fmt.Sprintf("/budget-items/%d", i.ID)).Put(map[string]interface{}{
		"budgetCategoryId": category.ID,
		"name":             "Life Insurance",
		"amount":           json.Number("200.00"),
	})
	var rb struct {
		BudgetItem models.BudgetItem `json:"budgetItem"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.Equal(i.ID, rb.BudgetItem.ID)
	as.Equal("Life Insurance", rb.BudgetItem.Name)
	as.Equal("200.00", rb.BudgetItem.Amount.String())

	all := models.BudgetItems{}
	total, _ := as.DB.Count(&all)
	as.Equal(1, total)
}

func (as *ActionSuite) Test_BudgetItems_Delete_Works() {
	user := SignedInUser(as)
	b := models.Budget{Year: 2017, Month: 11, UserID: user.ID}
	b.FindOrCreate(as.DB)
	category := models.BudgetCategory{}
	as.DB.BelongsTo(&b).First(&category)

	i := models.BudgetItem{
		BudgetCategoryId: category.ID,
		Amount:           json.Number("10.00"),
		Name:             "Savings",
	}
	as.DB.Create(&i)

	beforeTotal, _ := as.DB.Count(&models.BudgetItems{})
	as.Equal(1, beforeTotal)

	r := as.JSON(fmt.Sprintf("/budget-items/%d", i.ID)).Delete()
	as.Equal(200, r.Code)

	afterTotal, _ := as.DB.Count(&models.BudgetItems{})
	as.Equal(0, afterTotal)
}

func (as *ActionSuite) Test_BudgetItems_Create_RequiresUser() {
	r := as.JSON("/budget-items").Post(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_BudgetItems_Update_RequiresUser() {
	r := as.JSON("/budget-items/1").Put(map[string]string{})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_BudgetItems_Delete_RequiresUser() {
	r := as.JSON("/budget-items/1").Delete()
	as.Equal(401, r.Code)
}
