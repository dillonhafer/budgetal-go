package grifts

import (
	"fmt"
	"os"
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

func QuietCommand(name string, arg ...string) error {
	cmd := exec.Command(name, arg...)
	err := cmd.Run()

	if err != nil {
		return err
	}

	return nil
}

func QuietCommandInDir(dir, name string, arg ...string) error {
	cmd := exec.Command(name, arg...)
	cmd.Dir = dir
	err := cmd.Run()

	if err != nil {
		return err
	}

	return nil
}

func CommandInDir(dir, name string, arg ...string) error {
	cmd := exec.Command(name, arg...)
	cmd.Dir = dir

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()

	if err != nil {
		return err
	}

	return nil
}

func Command(name string, arg ...string) error {
	cmd := exec.Command(name, arg...)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()

	if err != nil {
		return err
	}

	return nil
}
