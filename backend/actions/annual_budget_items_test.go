package actions

import (
	"encoding/json"
	"fmt"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

type AnnualBudgetItemParams struct {
	AnnualBudgetID int         `json:"annualBudgetId"`
	Name           string      `json:"name,omitempty"`
	Amount         json.Number `json:"amount,omitempty"`
	DueDate        string      `json:"dueDate,omitempty"`
	Interval       int         `json:"interval"`
	Paid           bool        `json:"paid"`
}

func (as *ActionSuite) Test_AnnualBudgetItems_Create_RequiresUser() {
	r := as.JSON("/annual-budget-items").Post(AnnualBudgetItemParams{
		AnnualBudgetID: 1,
		Amount:         json.Number("0.00"),
		Name:           "Insurance",
		DueDate:        "2017-12-12",
		Paid:           false,
		Interval:       8,
	})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_AnnualBudgetItems_Create_Works() {
	user := SignedInUser(as)
	b := models.AnnualBudget{Year: 2017, UserID: user.ID}
	b.FindOrCreate(as.DB)

	// Create Annual Budget
	r := as.JSON("/annual-budget-items").Post(AnnualBudgetItemParams{
		AnnualBudgetID: b.ID,
		Amount:         json.Number("0.00"),
		Name:           "Insurance",
		DueDate:        "2017-12-12",
		Paid:           false,
		Interval:       8,
	})
	var rb struct {
		AnnualBudgetItem models.AnnualBudgetItem `json:"annualBudgetItem"`
	}
	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.Equal("Insurance", rb.AnnualBudgetItem.Name)
	as.Equal(b.ID, rb.AnnualBudgetItem.AnnualBudgetID)
	as.Equal("0.00", rb.AnnualBudgetItem.Amount.String())
	as.Equal("2017-12-12", rb.AnnualBudgetItem.DueDate)
	as.Equal(false, rb.AnnualBudgetItem.Paid)
	as.Equal(8, rb.AnnualBudgetItem.Interval)

	all := models.AnnualBudgetItems{}
	total, _ := as.DB.Count(&all)
	as.Equal(1, total)
}

func (as *ActionSuite) Test_AnnualBudgetItems_Update_Works() {
	user := SignedInUser(as)
	b := models.AnnualBudget{Year: 2017, UserID: user.ID}
	b.FindOrCreate(as.DB)
	i := models.AnnualBudgetItem{
		AnnualBudgetID: b.ID,
		Amount:         json.Number("0.00"),
		Name:           "Insurance",
		DueDate:        "2017-12-12",
		Paid:           true,
		Interval:       8,
	}
	as.DB.Create(&i)

	// Update Annual Budget
	r := as.JSON(fmt.Sprintf("/annual-budget-items/%d", i.ID)).Put(AnnualBudgetItemParams{
		Amount:   json.Number("10.00"),
		Name:     "Life Insurance",
		DueDate:  "2017-12-24",
		Paid:     false,
		Interval: 12,
	})
	var rb struct {
		AnnualBudgetItem models.AnnualBudgetItem `json:"annualBudgetItem"`
	}

	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(200, r.Code)
	as.Equal(i.ID, rb.AnnualBudgetItem.ID)
	as.Equal("Life Insurance", rb.AnnualBudgetItem.Name)
	as.Equal(b.ID, rb.AnnualBudgetItem.AnnualBudgetID)
	as.Equal("10.00", rb.AnnualBudgetItem.Amount.String())
	as.Equal("2017-12-24", rb.AnnualBudgetItem.DueDate)
	as.Equal(false, rb.AnnualBudgetItem.Paid)
	as.Equal(12, rb.AnnualBudgetItem.Interval)

	all := models.AnnualBudgetItems{}
	total, _ := as.DB.Count(&all)
	as.Equal(1, total)
}

func (as *ActionSuite) Test_AnnualBudgetItems_Update_RequiresUser() {
	user := as.CreateUser(false)
	b := models.AnnualBudget{Year: 2017, UserID: user.ID}
	b.FindOrCreate(as.DB)
	i := models.AnnualBudgetItem{
		AnnualBudgetID: b.ID,
		Amount:         json.Number("0.00"),
		Name:           "Insurance",
		DueDate:        "2017-12-12",
		Paid:           false,
		Interval:       8,
	}
	as.DB.Create(&i)
	all := models.AnnualBudgetItems{}
	total, _ := as.DB.Count(&all)
	as.Equal(1, total)

	// Update Annual Budget
	r := as.JSON(fmt.Sprintf("/annual-budget-items/%d", i.ID)).Put(AnnualBudgetItemParams{
		Amount:   json.Number("10.00"),
		Name:     "Life Insurance",
		DueDate:  "2017-12-24",
		Paid:     false,
		Interval: 12,
	})
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_AnnualBudgetItems_Delete_Works() {
	user := as.SignedInUser()
	b := models.AnnualBudget{Year: 2017, UserID: user.ID}
	b.FindOrCreate(as.DB)
	i := models.AnnualBudgetItem{
		AnnualBudgetID: b.ID,
		Amount:         json.Number("0.00"),
		Name:           "Insurance",
		DueDate:        "2017-12-12",
		Paid:           false,
		Interval:       8,
	}
	as.DB.Create(&i)

	beforeTotal, _ := as.DB.Count(&models.AnnualBudgetItems{})
	as.Equal(1, beforeTotal)

	// Delete Annual Budget
	r := as.JSON(fmt.Sprintf("/annual-budget-items/%d", i.ID)).Delete()
	as.Equal(200, r.Code)

	afterTotal, _ := as.DB.Count(&models.AnnualBudgetItems{})
	as.Equal(0, afterTotal)
}

func (as *ActionSuite) Test_AnnualBudgetItems_Delete_RequiresUser() {
	user := as.CreateUser(false)
	b := models.AnnualBudget{Year: 2017, UserID: user.ID}
	b.FindOrCreate(as.DB)
	i := models.AnnualBudgetItem{
		AnnualBudgetID: b.ID,
		Amount:         json.Number("0.00"),
		Name:           "Insurance",
		DueDate:        "2017-12-12",
		Paid:           false,
		Interval:       8,
	}
	as.DB.Create(&i)

	beforeTotal, _ := as.DB.Count(&models.AnnualBudgetItems{})
	as.Equal(1, beforeTotal)

	// Delete Annual Budget Attempt
	r := as.JSON(fmt.Sprintf("/annual-budget-items/%d", i.ID)).Delete()
	as.Equal(401, r.Code)

	afterTotal, _ := as.DB.Count(&models.AnnualBudgetItems{})
	as.Equal(1, afterTotal)
}
