package models_test

import (
	"encoding/json"

	"github.com/dillonhafer/budgetal-go/backend/models"
)

func (as *ModelSuite) Test_NetWorth_Json() {
	u := &models.NetWorth{
		ID:    1,
		Year:  2018,
		Month: 8,
	}
	b, _ := json.Marshal(u)
	netWorth := string(b)

	as.Contains(netWorth, `"id":1`)
	as.Contains(netWorth, `"year":2018`)
	as.Contains(netWorth, `"month":8`)
}
