package grifts

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/fatih/color"
	"github.com/gobuffalo/envy"
	. "github.com/markbates/grift/grift"
)

var _ = envy.Load(".env.production")
var server = envy.Get("server", "deploy@budgetal")
var deployDir = envy.Get("deploy_dir", "budgetal-beta")

func timeTrack(s time.Time) {
	start := s.Round(time.Second)
	end := time.Now().Round(time.Second)

	elapsed := end.Sub(start)
	FormatLog(color.BlueString(fmt.Sprintf("✨  Done in %s", elapsed)))
}

var _ = Desc("deploy", "Build/Deploy both the frontend/backend")
var _ = Set("deploy", func(c *Context) error {
	defer timeTrack(time.Now())
	fmt.Println("Starting full deploy as", server)
	Run("deploy:_backend", c)
	Run("deploy:_frontend", c)
	Run("deploy:_restart", c)
	return nil
})

var _ = Desc("deploy:backend", "Build/Deploy the backend")
var _ = Set("deploy:backend", func(c *Context) error {
	defer timeTrack(time.Now())
	fmt.Println("Starting backend deploy as", server)
	Run("deploy:_backend", c)
	Run("deploy:_restart", c)
	return nil
})

var _ = Desc("deploy:restart", "Restart App")
var _ = Set("deploy:restart", func(c *Context) error {
	defer timeTrack(time.Now())
	fmt.Println("Restarting app as", server)
	Run("deploy:_restart", c)
	return nil
})

var _ = Desc("deploy:frontend", "Build/Deploy the frontend")
var _ = Set("deploy:frontend", func(c *Context) error {
	defer timeTrack(time.Now())
	fmt.Println("Starting frontend deploy as", server)
	Run("deploy:_frontend", c)
	return nil
})

var _ = Namespace("deploy", func() {
	Desc("daemon-reload", "Reload the system daemon")
	Set("daemon-reload", func(c *Context) error {
		Comment("deploy:daemon-reload")
		return Command("ssh", "budgetal", "systemctl daemon-reload")
	})

	Set("_restart", func(c *Context) error {
		Comment("Restarting app")
		return Command("ssh", "budgetal", "systemctl restart budgetal")
	})

	Set("build-backend", func(c *Context) error {
		Comment("Compiling new binary")
		QuietCommand("buffalo", "bill", "--ldflags=-s -w", "-o", "bin/budgetal")
		FormatLog("Built bin/budgetal")

		Comment("Compressing binary")
		Command("tar", "czf", "bin/budgetal.tar.gz", "bin/budgetal")
		Command("rm", "bin/budgetal")

		file, _ := os.Open("bin/budgetal.tar.gz")
		defer file.Close()
		stat, _ := file.Stat()
		FormatLog(fmt.Sprintf("File size is %v MB", stat.Size()/1024/1024))
		return nil
	})

	Set("upload-backend", func(c *Context) error {
		Comment("Uploading backend")
		FormatLog("Ensuring web folder")
		Command("ssh", server, "mkdir", "-p", deployDir)

		FormatLog("Copying build")
		Command("scp", "-q", "bin/budgetal.tar.gz", fmt.Sprintf("%s:%s/", server, deployDir))
		FormatLog("Decompressing build")
		Command("ssh", server, fmt.Sprintf("tar xzf %s/budgetal.tar.gz -C %s --strip-components=1", deployDir, deployDir))
		Command("ssh", server, fmt.Sprintf("rm %s/budgetal.tar.gz", deployDir))
		return nil
	})

	Set("build-frontend", func(c *Context) error {
		Comment("Running yarn build")
		QuietCommandInDir("frontend", "yarn", "build")

		Comment("Removing sourcemaps")
		Command("rm", "-rf", "frontend/build/users")

		sourceMaps, _ := filepath.Glob("frontend/build/static/*/*.map")
		for _, path := range sourceMaps {
			Command("rm", path)
			FormatLog(fmt.Sprintf("Removed %s", path))
		}

		jsFiles, _ := filepath.Glob("frontend/build/static/js/main*.js")
		for _, path := range jsFiles {
			Command("sed", "-i", "", "-e", "/\\/\\/# sourceMappingURL.*/d", path)
			FormatLog(fmt.Sprintf("Removed comment from %s", path))
		}

		cssFiles, _ := filepath.Glob("frontend/build/static/css/main*.css")
		for _, path := range cssFiles {
			Command("sed", "-i", "", "-e", "/\\/\\*# sourceMappingURL.*/d", path)
			FormatLog(fmt.Sprintf("Removed comment from %s", path))
		}

		Comment("Compressing frontend")
		CommandInDir("frontend", "tar", "czf", "frontend.tar.gz", "build")
		Command("mv", "frontend/frontend.tar.gz", "bin/frontend.tar.gz")
		Command("rm", "-rf", "frontend/build")

		file, err := os.Open("bin/frontend.tar.gz")
		defer file.Close()
		if err != nil {
			return err
		}

		stat, _ := file.Stat()
		FormatLog(fmt.Sprintf("File size is %v MB", stat.Size()/1024/1024))
		return nil
	})

	Set("upload-frontend", func(c *Context) error {
		Comment("Uploading frontend")
		FormatLog("Ensuring web folder")
		Command("ssh", server, "mkdir", "-p", deployDir)

		FormatLog("Copying frontend")
		Command("scp", "-q", "bin/frontend.tar.gz", fmt.Sprintf("%s:%s/", server, deployDir))
		FormatLog("Decompressing frontend")
		Command("ssh", server, fmt.Sprintf("tar xzf %s/frontend.tar.gz -C %s", deployDir, deployDir))
		Command("ssh", server, fmt.Sprintf("rm %s/frontend.tar.gz", deployDir))

		Comment("Symlinking avatar directory")
		cmd := fmt.Sprintf("if [ ! -L \"%s/build/users\" ]; then ln -s $(pwd)/%s/frontend/public/users $(pwd)/%s/build/users; fi", deployDir, deployDir, deployDir)
		Command("ssh", server, cmd)
		FormatLog("Avatar directory symlinked")
		return nil
	})

	Set("_backend", func(c *Context) error {
		Comment("Building Backend")
		Run("deploy:build-backend", c)
		Run("deploy:upload-backend", c)

		FormatLog("New backend released")
		return nil
	})

	Set("_frontend", func(c *Context) error {
		Comment("Building Frontend")
		Run("deploy:build-frontend", c)
		Run("deploy:upload-frontend", c)

		FormatLog("New frontend released")
		return nil
	})
})
