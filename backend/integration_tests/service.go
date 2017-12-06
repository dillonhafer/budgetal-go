package integration_tests

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"time"
)

func NewSeleniumService(seleniumPath string, port int, opts ...ServiceOption) (*Service, error) {
	cmd := exec.Command(seleniumPath, "-port", strconv.Itoa(port))
	s, err := newService(cmd, port, opts...)
	if err != nil {
		return nil, err
	}
	if err := s.start(port); err != nil {
		return nil, err
	}
	return s, nil
}

func NewCRAService(port int, dir string) (*http.Server, error) {
	addr := fmt.Sprintf("127.0.0.1:%d", port)

	s := &http.Server{
		Addr:           addr,
		Handler:        http.FileServer(http.Dir(dir)),
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	var err error
	go func() {
		err = s.ListenAndServe()
	}()

	for i := 0; i < 5; i++ {
		time.Sleep(time.Second)
		resp, err := http.Get(addr + "/")
		if err == nil {
			resp.Body.Close()
			switch resp.StatusCode {
			case http.StatusOK:
				i = 30
				return s, nil
			}
		}
	}

	return s, err
}

type ServiceOption func(*Service) error
type Service struct {
	port            int
	addr            string
	cmd             *exec.Cmd
	shutdownURLPath string

	display, xauthPath string

	output io.Writer
}

func newService(cmd *exec.Cmd, port int, opts ...ServiceOption) (*Service, error) {
	s := &Service{
		port: port,
		addr: fmt.Sprintf("http://localhost:%d", port),
	}
	for _, opt := range opts {
		if err := opt(s); err != nil {
			return nil, err
		}
	}
	cmd.Stderr = s.output
	cmd.Stdout = s.output
	cmd.Env = os.Environ()

	s.cmd = cmd
	return s, nil
}

func (s *Service) start(port int) error {
	if err := s.cmd.Start(); err != nil {
		return err
	}

	for i := 0; i < 30; i++ {
		time.Sleep(time.Second)
		resp, err := http.Get(s.addr + "/status")
		if err == nil {
			resp.Body.Close()
			switch resp.StatusCode {
			// Selenium <3 returned Forbidden and BadRequest. ChromeDriver and
			// Selenium 3 return OK.
			case http.StatusForbidden, http.StatusBadRequest, http.StatusOK:
				return nil
			}
		}
	}

	return fmt.Errorf("server did not respond on port %d", port)
}

func (s *Service) Stop() error {
	if err := s.cmd.Process.Kill(); err != nil {
		return err
	}

	if err := s.cmd.Wait(); err != nil && err.Error() != "signal: killed" {
		return err
	}

	return nil
}
