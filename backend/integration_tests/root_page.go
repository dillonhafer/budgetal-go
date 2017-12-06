package integration_tests

import (
	"time"

	"github.com/tebeka/selenium"
)

type RootPage struct {
	Suite *IntegrationSuite
}

func (p *RootPage) VisitPage() {
	if err := p.Suite.Driver.Get(p.Suite.RootPath); err != nil {
		p.Suite.FailNow("Could not visit home page")
	}
}

func (p *RootPage) ClickSignIn() {
	elem, err := p.Suite.Driver.FindElement(selenium.ByXPATH, "//div[text()='Sign In']")
	if err != nil {
		p.Suite.FailNow("Could not find link 'sign in'")
	}

	if err := elem.Click(); err != nil {
		p.Suite.FailNow("Could not click 'Sign In'")
	}
}

func (p *RootPage) ClickRegister() {
	elem, err := p.Suite.Driver.FindElement(selenium.ByLinkText, "Register")
	if err != nil {
		p.Suite.FailNow("Could not find link 'Register'")
	}

	if err := elem.Click(); err != nil {
		p.Suite.FailNow("Could not click 'Register'")
	}
}

func (p *RootPage) FillInEmail(email string) {
	elem, err := p.Suite.Driver.FindElement(selenium.ByCSSSelector, ".register-form #email")
	if err != nil {
		p.Suite.FailNow("Could not find field '#email'")
	}

	if err := elem.Clear(); err != nil {
		p.Suite.FailNow("Could not clear field '#email'")
	}

	err = elem.SendKeys(email)
	if err != nil {
		p.Suite.FailNow("Could not fill field '#email'")
	}
}

func (p *RootPage) FillInPassword(password string) {
	elem, err := p.Suite.Driver.FindElement(selenium.ByCSSSelector, ".register-form #password")
	if err != nil {
		p.Suite.FailNow("Could not find field '#password'")
	}
	if err := elem.Clear(); err != nil {
		p.Suite.FailNow("Could not clear field '#password'")
	}

	err = elem.SendKeys(password)
	if err != nil {
		p.Suite.FailNow("Could not fill field '#password'")
	}
}

func (p *RootPage) FillInPasswordConfirmation(password string) {
	elem, err := p.Suite.Driver.FindElement(selenium.ByCSSSelector, ".register-form #password-confirmation")
	if err != nil {
		p.Suite.FailNow("Could not find field '#password-confirmation'")
	}
	if err := elem.Clear(); err != nil {
		p.Suite.FailNow("Could not clear field '#password-confirmation'")
	}

	err = elem.SendKeys(password)
	if err != nil {
		p.Suite.FailNow("Could not fill field '#password-confirmation'")
	}
}

func (p *RootPage) ClickRegisterButton() {
	elem, err := p.Suite.Driver.FindElement(selenium.ByXPATH, "//button[@type='submit']/span[.='Register']")
	if err != nil {
		p.Suite.FailNow("Could not find button 'Register'")
	}

	elem, err = elem.FindElement(selenium.ByXPATH, "..")
	if err != nil {
		p.Suite.FailNow("Could not click 'Register'")
	}

	if err := elem.Click(); err != nil {
		p.Suite.FailNow("Could not click 'Register'")
	}
}

func (p *RootPage) EnsureRegisterFormVisible() {
	limit := 20
	found := false
	sum := 0
	for sum < limit {
		sum += sum

		elem, _ := p.Suite.Driver.FindElement(selenium.ByCSSSelector, ".register-form")
		isDisplayed, _ := elem.IsDisplayed()
		if isDisplayed {
			found = true
			sum = limit
		}

		time.Sleep(100 * time.Millisecond)
	}

	if !found {
		p.Suite.FailNow("Could not find 'Register Form'")
	}
}

func (p *RootPage) HasWelcomeNotificaton() bool {
	return true
}
