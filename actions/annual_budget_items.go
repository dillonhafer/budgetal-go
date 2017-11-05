package actions

import (
	"encoding/json"
	"errors"
	"strconv"

	"github.com/dillonhafer/budgetal-go/models"
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
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.AnnualBudgetItem{"annualBudgetItem": item}))
}

func AnnualBudgetItemsUpdate(c buffalo.Context, currentUser *models.User) error {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	p, paramErr := parseParams(c)
	if paramErr != nil {
		err := map[string]string{"error": paramErr.Error()}
		return c.Render(401, r.JSON(err))
	}

	tx := c.Value("tx").(*pop.Connection)
	item, findErr := findAnnualBudgetItem(int(id), currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	item.Name = p.Name
	item.Amount = p.Amount
	item.DueDate = p.DueDate
	item.Paid = p.Paid
	item.Interval = p.Interval

	updateError := tx.Update(item)
	if updateError != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.AnnualBudgetItem{"annualBudgetItem": item}))
}

func AnnualBudgetItemsDelete(c buffalo.Context, currentUser *models.User) error {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	tx := c.Value("tx").(*pop.Connection)

	item, findErr := findAnnualBudgetItem(int(id), currentUser.ID, tx)
	if findErr != nil {
		err := map[string]string{"error": "Permission denied"}
		return c.Render(403, r.JSON(err))
	}

	deleteErr := tx.Destroy(item)
	if deleteErr != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findAnnualBudget(year, user_id int, tx *pop.Connection) (*models.AnnualBudget, error) {
	b := models.AnnualBudget{}
	err := tx.Where("user_id = ? and year = ?", user_id, year).First(&b)
	return &b, err
}

func findAnnualBudgetItem(id, user_id int, tx *pop.Connection) (*models.AnnualBudgetItem, error) {
	i := models.AnnualBudgetItem{}
	q := `
		select annual_budget_items.*
		from annual_budget_items
		join annual_budgets on annual_budget_items.annual_budget_id = annual_budgets.id
		where annual_budgets.user_id = ?
		and annual_budget_items.id = ?
		limit 1
	`
	err := tx.RawQuery(q, user_id, id).First(&i)
	return &i, err
}
