package actions

import (
	"encoding/json"
	"errors"

	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

type AnnualBudgetItemParams struct {
	Year           int         `json:"year,omitempty"`
	AnnualBudgetID int         `json:"annualBudgetId,omitempty"`
	Name           string      `json:"name,omitempty"`
	Amount         json.Number `json:"amount,omitempty"`
	DueDate        string      `json:"dueDate,omitempty"`
	Interval       int         `json:"interval"`
	Paid           bool        `json:"paid"`
}

func parseParams(c buffalo.Context) (AnnualBudgetItemParams, error) {
	decoder := json.NewDecoder(c.Request().Body)
	var p AnnualBudgetItemParams
	err := decoder.Decode(&p)
	if err != nil {
		c.Logger().Debug(err)
		err := errors.New("Invalid Budget Item")
		return AnnualBudgetItemParams{}, err
	}

	return p, nil
}

// AnnualBudgetItemsCreate default implementation.
func AnnualBudgetItemsCreate(c buffalo.Context, currentUser *models.User) error {
	p, paramErr := parseParams(c)
	if paramErr != nil {
		err := map[string]string{"error": paramErr.Error()}
		return c.Render(401, r.JSON(err))
	}

	tx := c.Value("tx").(*pop.Connection)
	budget, findErr := findAnnualBudget(p.Year, currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	item := &models.AnnualBudgetItem{
		AnnualBudgetID: budget.ID,
		Name:           p.Name,
		Amount:         p.Amount,
		DueDate:        p.DueDate,
		Paid:           p.Paid,
		Interval:       p.Interval,
	}

	createError := tx.Create(item)
	if createError != nil {
		err := map[string]string{"error": "Could not crerate item"}
		return c.Render(403, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.AnnualBudgetItem{"annualBudgetItem": item}))
}
func AnnualBudgetItemsUpdate(c buffalo.Context, currentUser *models.User) error {
	return c.Render(200, r.JSON(map[string]string{"an items": "update"}))
}

func findAnnualBudget(year, user_id int, tx *pop.Connection) (*models.AnnualBudget, error) {
	b := models.AnnualBudget{}
	err := tx.Where("user_id = ? and year = ?", user_id, year).First(&b)
	return &b, err
}
