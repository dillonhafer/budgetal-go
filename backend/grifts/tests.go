package grifts

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"

	"github.com/fatih/color"
	"github.com/markbates/grift/grift"
)

type LogWriter struct {
	logger *log.Logger
}

func NewLogWriter(l *log.Logger) *LogWriter {
	lw := &LogWriter{}
	lw.logger = l
	return lw
}

func (lw LogWriter) Write(p []byte) (n int, err error) {
	o := string(p)
	printed := false
	if strings.HasPrefix(o, "ok") {
		o = strings.Replace(o, "ok", color.GreenString("----> PASS"), -1)
	}

	if strings.HasPrefix(o, "=== RUN") {
		//o = color.BlueString(o)
		return len(p), nil
	}

	if strings.HasPrefix(o, "--- PASS") {
		o = color.GreenString(".")
		printed = true
		fmt.Print(o)
	}

	if strings.HasPrefix(o, "PASS") {
		o = "\n"
	}

	if !printed {
		if strings.HasSuffix(o, "\n") {
			fmt.Print(o)
		} else {
			fmt.Print(o + "\n")
		}
	}
	// lw.logger.Printf("%s", o)
	return len(p), nil
}

func notice(s string) {
	fmt.Printf("%s %s\n", color.GreenString("---->"), s)
}

var _ = grift.Desc("t", "Budgetal Tests")
var _ = grift.Add("t", func(c *grift.Context) error {
	color.NoColor = false
	var (
		cmdOut []byte
		err    error
	)
	cmd := "buffalo"
	args := []string{"version"}
	if cmdOut, err = exec.Command(cmd, args...).Output(); err != nil {
		return err
	}
	notice(strings.Replace(string(cmdOut), "\n", "", -1))

	cmd = "buffalo"
	args = []string{"db", "drop", "-e", "test"}
	if cmdOut, err = exec.Command(cmd, args...).Output(); err != nil {
		return err
	}
	notice("Dropped test database")

	cmd = "buffalo"
	args = []string{"db", "create", "-e", "test"}
	if cmdOut, err = exec.Command(cmd, args...).Output(); err != nil {
		return err
	}
	notice("Created test database")

	cmd = "buffalo"
	args = []string{"db", "migrate", "-e", "test"}
	if cmdOut, err = exec.Command(cmd, args...).Output(); err != nil {
		return err
	}
	notice("Migrated test database")

	os.Setenv("GO_ENV", "test")
	notice("Running tests")
	com := exec.Command("go", "test", "-v", "-p", "1", "github.com/dillonhafer/budgetal/backend/actions", "github.com/dillonhafer/budgetal/backend/models")
	com.Stdin = os.Stdin
	com.Stdout = NewLogWriter(log.New(os.Stdout, "", 0))
	// com.Stderr = os.Stderr
	com.Run()

	notice("Done.")
	return nil
})
