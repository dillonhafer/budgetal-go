package mutations

import (
	"strconv"

	"github.com/dillonhafer/budgetal/backend/context"
	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/gobuffalo/pop"
	"github.com/graphql-go/graphql"
)

// AssetDelete will delete an asset or liability
func AssetDelete(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	buffalo := context.BuffaloContext(params.Context)
	idString, isOK := params.Args["id"].(string)
	id, err := strconv.Atoi(idString)
	if err != nil || !isOK {
		return nil, nil
	}

	asset, err := findAssetLiability(id, currentUser.ID)
	if err != nil {
		return nil, nil
	}

	// delete assets/liabilities (transactionally)
	models.DB.Transaction(func(tx *pop.Connection) error {
		err := asset.DestroyAllNetWorthItems(tx, buffalo.Logger())
		if err != nil {
			return nil
		}

		// delete item
		err = tx.Destroy(asset)
		if err != nil {
			return err
		}

		return nil
	})

	return asset, nil
}

// AssetUpsert will insert or update an asset or liability
func AssetUpsert(params graphql.ResolveParams) (interface{}, error) {
	currentUser := context.CurrentUser(params.Context)
	idString, _ := params.Args["id"].(string)
	name, isOK := params.Args["name"].(string)
	if !isOK {
		return nil, nil
	}

	isAsset, isOK := params.Args["isAsset"].(bool)
	if !isOK {
		return nil, nil
	}

	id, err := strconv.Atoi(idString)
	if err == nil {
		asset, err := findAssetLiability(id, currentUser.ID)
		if err != nil {
			return nil, nil
		}

		asset.Name = name
		err = models.DB.Update(asset)
		if err != nil {
			return nil, nil
		}

		return asset, nil
	}

	asset := &models.AssetLiability{Name: name, IsAsset: isAsset, UserID: currentUser.ID}
	err = models.DB.Create(asset)
	if err != nil {
		return nil, nil
	}

	return asset, nil
}

func findAssetLiability(id, userID int) (*models.AssetLiability, error) {
	al := models.AssetLiability{}
	err := models.DB.Where("user_id = ? and id = ?", userID, id).First(&al)
	return &al, err
}
