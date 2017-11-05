package grifts

import (
	"github.com/dillonhafer/budgetal-go/actions"
	"github.com/gobuffalo/buffalo"
)

func init() {
	buffalo.Grifts(actions.App())
}
