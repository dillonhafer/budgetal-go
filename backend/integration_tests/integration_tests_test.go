package integration_tests

import (
	"fmt"
	"os"
	"testing"

	"github.com/dillonhafer/budgetal-go/backend/actions"
	"github.com/gobuffalo/suite"
	"github.com/tebeka/selenium"
)

const (
	seleniumPath     = "/usr/local/bin/selenium-server"
	chromeDriverPath = "/usr/local/bin/chromedriver"
	frontedDir       = "/Users/dillon/dev/go/src/github.com/dillonhafer/budgetal-go/frontend/integration-build"
	seleniumPort     = 4444
	frontedPort      = 4445
	chromePort       = 4446
)

type IntegrationSuite struct {
	*suite.Action
	Driver   selenium.WebDriver
	RootPath string
}

func Test_IntegrationSuite(t *testing.T) {
	if os.Getenv("INTEGRATION_TESTS") == "" {
		return
	}
	// Start Selenium WebServer
	selenium.SetDebug(true)
	selService, err := NewSeleniumService(seleniumPath, seleniumPort)
	if err != nil {
		t.Fatal(err)
	}
	defer selService.Stop()

	// Start Static WebServer
	craService, err := NewCRAService(frontedPort, frontedDir)
	if err != nil {
		t.Fatal(err)
	}
	defer craService.Close()

	// Start Chrome
	service, err := selenium.NewChromeDriverService(chromeDriverPath, chromePort)
	defer service.Stop()

	// Setup chrome
	caps := selenium.Capabilities{"browserName": "chrome"}
	wd, err := selenium.NewRemote(caps, fmt.Sprintf("http://localhost:%d/wd/hub", chromePort))
	if err != nil {
		t.Fatal(err)
	}
	defer wd.Quit()

	rootPath := fmt.Sprintf("http://localhost:%d", frontedPort)
	as := &IntegrationSuite{suite.NewAction(actions.App()), wd, rootPath}
	suite.Run(t, as)
}
