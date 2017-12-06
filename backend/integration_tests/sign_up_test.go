package integration_tests

func (as *IntegrationSuite) Test_SignUp() {
	rootPage := &RootPage{as}

	rootPage.VisitPage()
	rootPage.ClickSignIn()
	rootPage.ClickRegister()

	rootPage.EnsureRegisterFormVisible()

	rootPage.FillInEmail("email@example.com")
	rootPage.FillInPassword("password")
	rootPage.FillInPasswordConfirmation("password")
	rootPage.ClickRegisterButton()

	as.True(rootPage.HasWelcomeNotificaton())
}
