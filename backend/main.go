package main

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/airbrake/gobrake"
	"github.com/dillonhafer/budgetal/backend/actions"
)

var StartTime = time.Now()

func main() {
	airbrakeProjectID, useAirbrake := os.LookupEnv("AIRBRAKE_PROJECT_ID")

	if useAirbrake {
		projectID, err := strconv.ParseInt(airbrakeProjectID, 0, 64)
		if err != nil {
			log.Fatal(err)
		}

		var airbrake = gobrake.NewNotifierWithOptions(&gobrake.NotifierOptions{
			ProjectId:   projectID,
			ProjectKey:  os.Getenv("AIRBRAKE_API_KEY"),
			Environment: os.Getenv("GO_ENV"),
		})
		defer airbrake.Close()
		defer airbrake.NotifyOnPanic()
	}

	app := actions.App()
	if err := app.Serve(); err != nil {
		log.Fatal(err)
	}
}
