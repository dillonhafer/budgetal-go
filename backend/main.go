package main

import (
	"log"

	"github.com/dillonhafer/budgetal-go/backend/actions"
)

func main() {
	app := actions.App()
	if err := app.Serve(); err != nil {
		log.Fatal(err)
	}
}
