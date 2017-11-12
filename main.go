package main

import (
	"log"

	"github.com/dillonhafer/budgetal-go/actions"
)

func main() {
	app := actions.App()
	if err := app.Serve(); err != nil {
		log.Fatal(err)
	}
}
