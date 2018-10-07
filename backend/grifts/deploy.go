package grifts

import (
	"fmt"
	"time"

	"github.com/fatih/color"
	"github.com/gobuffalo/envy"
	"github.com/markbates/grift/grift"
)

var deployEnv = envy.Get("to", "production")
var envFile = fmt.Sprintf(".env.%s", deployEnv)
var _ = envy.Load(envFile)
var server = envy.Get("server", "")
var deployDir = envy.Get("deploy_dir", "")
var localAvatars = envy.Get("LOCAL_AVATARS", "no") == "yes"

func timeTrack(s time.Time) {
	start := s.Round(time.Second)
	end := time.Now().Round(time.Second)

	elapsed := end.Sub(start)
	FormatLog(color.BlueString(fmt.Sprintf("✨  Done in %s", elapsed)))
}

var _ = grift.Desc("release", "Build/Deploy the backend")
var _ = grift.Set("release", func(c *grift.Context) error {
	defer timeTrack(time.Now())
	fmt.Println("Starting full deploy as", server)

	Comment("Compiling new binary")
	QuietCommand("buffalo", "bill", "--ldflags=-s -w", "-o", "bin/budgetal")
	FormatLog("Built bin/budgetal")

	Comment("Clean heroku dir")
	Command("rm", "-rf", "budgetal-production")

	Comment("Get latest heroku deploy")
	Command("heroku", "git:clone", "-a", "budgetal-production")

	Comment("Copy latest bin to git repo")
	Command("cp", "bin/budgetal", "budgetal-production/bin/budgetal")

	Comment("Commit new version")
	QuietCommandInDir("budgetal-production", "git", "add", ".")
	QuietCommandInDir("budgetal-production", "git", "commit", "-m", "New version")

	QuietCommandInDir("budgetal-production", "git", "checkout", "--orphan", "new-version")

	// Add all files and commit them
	QuietCommandInDir("budgetal-production", "git", "add", "-A")
	QuietCommandInDir("budgetal-production", "git", "commit", "-m", "New version")

	// Deletes the master branch
	QuietCommandInDir("budgetal-production", "git", "branch", "-D", "master")

	// Rename the current branch to master
	QuietCommandInDir("budgetal-production", "git", "branch", "-m", "master")

	// Remove the old files
	QuietCommandInDir("budgetal-production", "git", "gc", "--aggressive", "--prune=all")

	// Force push master branch to heroku
	Comment("Push to heroku")
	QuietCommandInDir("budgetal-production", "git", "push", "-f", "heroku", "master")

	Comment("Run migrations")
	QuietCommandInDir("budgetal-production", "heroku", "run", "'bin/./budgetal migrate'")

	Comment("Cleaning up")
	Command("rm", "-rf", "budgetal-production")
	return nil
})
