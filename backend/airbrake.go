package main

import (
	"log"
	"os"
	"strconv"

	"github.com/airbrake/gobrake"
)

// InitializeAirbrake configures airbrake based on ENV vars
func InitializeAirbrake() func() {
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

		return func() {
			airbrake.Close()
			airbrake.NotifyOnPanic()
		}

	}

	return func() {}
}
