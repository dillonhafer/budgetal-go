package actions

import "github.com/dillonhafer/budgetal-go/models"

func (as *ActionSuite) Test_SignOut() {
	as.SignedInUser()

	s := models.Sessions{}
	as.DB.All(&s)
	as.Equal(1, len(s))
	as.False(s[0].ExpiredAt.Valid)

	r := as.JSON("/sign-out").Delete()

	as.Equal(200, r.Code)
	s = models.Sessions{}
	as.DB.All(&s)
	as.Equal(1, len(s))
	as.NotEmpty(s[0].ExpiredAt)
}

func (as *ActionSuite) Test_SignOut_RequiresUser() {
	r := as.JSON("/sign-out").Delete()
	as.Equal(401, r.Code)
}
