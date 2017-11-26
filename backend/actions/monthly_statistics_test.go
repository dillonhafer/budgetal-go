package actions

import "encoding/json"

func (as *ActionSuite) Test_MonthlyStatistics_Show() {
	as.SignedInUser()

	type Category struct {
		Name        string `json:"name"`
		AmountSpent string `json:"amountSpent"`
	}
	var resp struct {
		Categories []Category `json:"budgetCategories"`
	}

	r := as.JSON("/monthly-statistics/2017/11").Get()
	json.NewDecoder(r.Body).Decode(&resp)
	as.Equal(200, r.Code)
	as.Equal(0, len(resp.Categories))
}

func (as *ActionSuite) Test_MonthlyStatistics_Show_RequiresUser() {
	r := as.JSON("/monthly-statistics/2017/11").Get()
	as.Equal(401, r.Code)
}

func (as *ActionSuite) Test_MonthlyStatistics_Show_BadMonth() {
	SignedInUser(as)

	response := as.JSON("/monthly-statistics/2017/13").Get()
	as.Equal(404, response.Code)
}

func (as *ActionSuite) Test_MonthlyStatistics_Show_BadYear() {
	SignedInUser(as)

	response := as.JSON("/monthly-statistics/2014/12").Get()
	as.Equal(404, response.Code)
}
