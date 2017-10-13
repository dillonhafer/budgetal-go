package grifts

import (
	"github.com/dillonhafer/budgetal/actions"
	"github.com/gobuffalo/buffalo"
)

func init() {
	buffalo.Grifts(actions.App())
}
