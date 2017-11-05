package main

import (
	"log"

	"github.com/dillonhafer/budgetal-go/actions"
	"github.com/gobuffalo/envy"
)

func main() {
	// PORT ENV var can be a full address
	port := envy.Get("PORT", "localhost:3000")
	app := actions.App()
	log.Fatal(app.Start(port))
}
