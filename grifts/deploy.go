package grifts

import (
	. "github.com/markbates/grift/grift"
)

var _ = Namespace("deploy", func() {
	Desc("daemon-reload", "Reload the system daemon")
	Set("daemon-reload", func(c *Context) error {
		Comment("deploy:daemon-reload")
		return Command("ssh", "budgetal", "systemctl daemon-reload")
	})

	Desc("restart", "Restarts the application")
	Set("restart", func(c *Context) error {
		Comment("deploy:restart")
		return Command("ssh", "budgetal", "systemctl restart budgetal")
	})
})
