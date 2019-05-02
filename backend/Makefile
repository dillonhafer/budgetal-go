build:
	@GOARCH=386 GOOS=linux GO111MODULE=on buffalo build --ldflags='-s -w'

release:
	@echo "\x1b[32;01m---->\x1b[0m Compiling new binary"
	@make build
	@echo "      Built bin/budgetal"

	@echo "\x1b[32;01m---->\x1b[0m Clean heroku dir"
	@rm -rf budgetal-production

	@echo "\x1b[32;01m---->\x1b[0m Get latest heroku deploy"
	@heroku git:clone -a budgetal-production &> tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Copy latest bin to git repo"
	@cp bin/budgetal budgetal-production/bin/budgetal

	@echo "\x1b[32;01m---->\x1b[0m Committing new version"
	@cd budgetal-production && git add .
	@cd budgetal-production && git commit -m "New version" &> ../tmp/build.log
	@cd budgetal-production && git checkout --orphan new-version &> ../tmp/build.log
	@cd budgetal-production && git add -A &> ../tmp/build.log
	@cd budgetal-production && git commit -m "New version" &> ../tmp/build.log
	@cd budgetal-production && git branch -D master &> ../tmp/build.log
	@cd budgetal-production && git branch -m master
	@cd budgetal-production && git gc --aggressive --prune=all &> ../tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Push to heroku"
	@cd budgetal-production && git push -f heroku master &> ../tmp/build.log

	@echo "\x1b[32;01m---->\x1b[0m Run migrations"
	@cd budgetal-production && heroku run 'bin/./budgetal migrate'

	@echo "\x1b[32;01m---->\x1b[0m Cleaning up"
	@rm -rf budgetal-production
	@echo "      ✨ Done."

test:
	GO111MODULE=on buffalo test

testc:
	GO111MODULE=on buffalo test -coverprofile=c.out ./... && go tool cover -html=c.out