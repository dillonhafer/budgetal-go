package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/buffalo"
)

// NetWorthItemsCreate creates a Net worth item
func NetWorthItemsCreate(c buffalo.Context, currentUser *models.User) error {
	year, err := strconv.Atoi(c.Param("year"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}
	month, err := strconv.Atoi(c.Param("month"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	item := &models.NetWorthItem{}
	if err := c.Bind(item); err != nil {
		return err
	}

	// Find NetWorth
	nw := models.NetWorth{}
	models.DB.Where("year = ? and month = ? and user_id = ?", year, month, currentUser.ID).First(&nw)

	// Find Asset
	al := models.AssetLiability{}
	assetError := models.DB.Where("id = ? and user_id = ?", item.AssetLiabilityID, currentUser.ID).First(&al)
	if assetError != nil {
		err := map[string]string{"error": "Permission Denied"}
		return c.Render(403, r.JSON(err))
	}

	// Set Approved Foreign Keys
	item.NetWorthID = nw.ID
	item.AssetLiabilityID = al.ID

	createError := models.DB.Create(item)
	if createError != nil {
		err := map[string]string{"error": "Item is invalid"}
		return c.Render(422, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*models.NetWorthItem{"item": item}))
}

// NetWorthItemsUpdate updates a Net worth item
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

// NetWorthItemsDelete deletes a Net worth item
func NetWorthItemsDelete(c buffalo.Context, currentUser *models.User) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	item, err := findNetWorthItem(id, currentUser.ID)
	if err != nil {
		return c.Render(403, r.JSON("Permission Denied"))
	}

	// delete item
	deleteErr := models.DB.Destroy(item)
	if deleteErr != nil {
		return c.Render(422, r.JSON(map[string]bool{"ok": false}))
	}

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findNetWorthItem(id, userID int) (*models.NetWorthItem, error) {
	al := models.NetWorthItem{}
	err := models.DB.Where("net_worth_items.id = ?", id).Join("net_worths", "net_worths.id=net_worth_items.net_worth_id and net_worths.user_id = ?", userID).First(&al)
	return &al, err
}
