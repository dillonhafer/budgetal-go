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

	@echo "\x1b[32;01m---->\x1b[0m Clean heroku dir"
	@rm -rf ${HEROKU_APP}

	@echo "\x1b[32;01m---->\x1b[0m Get latest heroku deploy"
	@heroku git:clone -a ${HEROKU_APP} &> tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Copy latest bin to git repo"
	@cp bin/budgetal ${HEROKU_APP}/bin/budgetal

	@echo "\x1b[32;01m---->\x1b[0m Committing new version"
	@cd ${HEROKU_APP} && git add .
	@cd ${HEROKU_APP} && git commit -m "New version" &> ../tmp/build.log
	@cd ${HEROKU_APP} && git checkout --orphan new-version &> ../tmp/build.log
	@cd ${HEROKU_APP} && git add -A &> ../tmp/build.log
	@cd ${HEROKU_APP} && git commit -m "New version" &> ../tmp/build.log
	@cd ${HEROKU_APP} && git branch -D master &> ../tmp/build.log
	@cd ${HEROKU_APP} && git branch -m master
	@cd ${HEROKU_APP} && git gc --aggressive --prune=all &> ../tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Push to heroku"
	@cd ${HEROKU_APP} && git push -f heroku master &> ../tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Run migrations"
	@cd ${HEROKU_APP} && heroku run 'bin/./budgetal migrate' &> ../tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Cleaning up"
	@rm -rf ${HEROKU_APP}
	@echo "      ✨ Done."

test:
	GO111MODULE=${GO111MODULE} buffalo test

testc:
	GO111MODULE=${GO111MODULE} buffalo test -coverprofile=c.out ./... && go tool cover -html=c.out
