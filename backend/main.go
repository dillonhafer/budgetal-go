package main

import (
	"log"
	"time"

	"github.com/dillonhafer/budgetal-go/backend/actions"
)

var StartTime = time.Now()

func main() {

	app := actions.App()
	if err := app.Serve(); err != nil {
		log.Fatal(err)
	}
}
