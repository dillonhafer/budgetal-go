package main

import (
	"log"

	"github.com/dillonhafer/budgetal/backend/actions"
)

func main() {
	closeAirbrake := InitializeAirbrake()
	defer closeAirbrake()

	app := actions.App()
	if err := app.Serve(); err != nil {
		log.Fatal(err)
	}
}
