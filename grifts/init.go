package grifts

import (
	"bytes"
	"fmt"
	"log"
	"os/exec"

	"github.com/dillonhafer/budgetal-go/actions"
	"github.com/fatih/color"
	"github.com/gobuffalo/buffalo"
)

func init() {
	buffalo.Grifts(actions.App())
}

func Comment(comment string) {
	fmt.Println(color.GreenString("---->"), comment)
}

func FormatLog(log string) {
	fmt.Println("     ", log)
}

func Command(name string, arg ...string) error {
	cmd := exec.Command(name, arg...)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out
	err := cmd.Run()
	output := out.String()

	if err != nil {
		log.Fatal(color.RedString(output))
		return err
	}

	if output != "" {
		FormatLog(output)
	}

	return nil
}
