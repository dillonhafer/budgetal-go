HEROKU_APP ?= budgetal-production
GO111MODULE ?= on
GOARCH ?= 386
GOOS ?= linux

build:
	GOARCH=${GOARCH} GOOS=${GOOS} GO111MODULE=${GO111MODULE} buffalo build --ldflags='-s -w'

release:
	@echo "\x1b[32;01m---->\x1b[0m Compiling new binary"
	@make build &> tmp/build.log
	@echo "      Built bin/budgetal"

	@echo "\x1b[32;01m---->\x1b[0m Upload binary"
	@echo "\x1b[32;01m---->\x1b[0m Copy latest bin to git repo"
	@scp bin/budgetal budgetal:budgetal/budgetal.new
	@ssh budgetal 'mv budgetal/budgetal.new budgetal/budgetal'

	@echo "\x1b[32;01m---->\x1b[0m Run migrations"
	@ssh budgetal 'DATABASE_URL=postgres:///budgetal_production?host=/var/run/postgresql budgetal/./budgetal migrate' &> tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Restart service"
	@ssh budgetal 'sudo /usr/sbin/service budgetal restart' &> tmp/build.log

	@echo "      ✨ Done."

test:
	GO111MODULE=${GO111MODULE} buffalo test

testc:
	GO111MODULE=${GO111MODULE} buffalo test -coverprofile=c.out ./... && go tool cover -html=c.out
