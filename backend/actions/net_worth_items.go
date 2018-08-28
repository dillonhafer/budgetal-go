package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
)

// NetWorthItemsCreate creates a Net worth item
func NetWorthItemsCreate(c buffalo.Context, currentUser *models.User) error {
	item := &models.AssetLiability{}
	if err := c.Bind(item); err != nil {
		return err
	}
	item.UserID = currentUser.ID

	createError := models.DB.Create(item)
	if createError != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.AssetLiability{"assetLiability": item}))
}

// NetWorthItemsUpdate updates an AssetLiability
func NetWorthItemsUpdate(c buffalo.Context, currentUser *models.User) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	item, err := findNetWorthItem(id, currentUser.ID)
	if err != nil {
		return c.Render(403, r.JSON("Permission Denied"))
	}

	params := models.NetWorthItem{}
	if err := c.Bind(&params); err != nil {
		return err
	}

	item.Amount = params.Amount

	updateError := models.DB.Update(item)
	if updateError != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.NetWorthItem{"item": item}))
}

// NetWorthItemsDelete deletes an AssetLiability and its items
func NetWorthItemsDelete(c buffalo.Context, currentUser *models.User) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	item, err := findAssetLiability(id, currentUser.ID)
	if err != nil {
		return c.Render(403, r.JSON("Permission Denied"))
	}

	// delete assets/liabilities (transactionally)
	models.DB.Transaction(func(tx *pop.Connection) error {
		expenseDeleteErrors := item.DestroyAllNetWorthItems(tx, c.Logger())
		if expenseDeleteErrors != nil {
			return c.Render(422, r.JSON(map[string]bool{"ok": false}))
		}

		// delete item
		deleteErr := tx.Destroy(item)
		if deleteErr != nil {
			return c.Render(422, r.JSON(map[string]bool{"ok": false}))
		}

		return nil
	})

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findNetWorthItem(id, userID int) (*models.NetWorthItem, error) {
	al := models.NetWorthItem{}
	err := models.DB.Where("net_worth_items.id = ?", id).Join("net_worths", "net_worths.id=net_worth_items.net_worth_id and net_worths.user_id = ?", userID).First(&al)
	return &al, err
}
