package actions

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal-go/models"
)

func (as *ActionSuite) Test_AnnualBudgetItems_RequiresUser() {
	r := as.JSON("/annual-budget-items").Post(AnnualBudgetItemParams{
		Year:     2017,
		Amount:   json.Number("0.00"),
		Name:     "Insurance",
		DueDate:  "2017-12-12",
		Paid:     false,
		Interval: 8,
	})
	var rb struct {
		AnnualBudgetItem models.AnnualBudgetItem `json:"annualBudgetItem"`
	}

	json.NewDecoder(r.Body).Decode(&rb)
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_AnnualBudgetItems_Create() {
	user := SignedInUser(as)
	b := models.AnnualBudget{Year: 2017, UserID: user.ID}
	b.FindOrCreate(as.DB)

	// Create Annual Budget
	r := as.JSON("/annual-budget-items").Post(AnnualBudgetItemParams{
		Year:     2017,
		Amount:   json.Number("0.00"),
		Name:     "Insurance",
		DueDate:  "2017-12-12",
		Paid:     false,
		Interval: 8,
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
}
