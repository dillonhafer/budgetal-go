# Budgetal [![CircleCI](https://img.shields.io/circleci/project/github/dillonhafer/budgetal-go/master.svg?style=flat-square)](https://circleci.com/gh/dillonhafer/budgetal-go)


A Budgetal implementation written in Go with Create React App on the
frontend

## Setup

How to setup the backend server:

```
$ go get -u -v github.com/gobuffalo/buffalo/...
$ go install -v github.com/gobuffalo/buffalo/buffalo
$ git clone https://github.com/dillonhafer/budgetal-go.git
$ cd budgetal-go
$ buffalo db create
$ buffalo db migrate
$ buffalo dev
```

How to setup the frontend server:

```
cd frontend
yarn install
yarn start
```

## Configuration

1. `PORT` the listening address can be configured by setting the `PORT` env var
2. `DATABASE_URL` the database connection can be configured by setting the `DATABASE_URL` env var
3. `CORS` space separated list of domains, defaults to `http://localhost:3001`

**The front end needs certain `ENV` vars at build time:**

1. `REACT_APP_HELP_FRAME` Used to populate the iframe in the help modal.
2. `REACT_APP_BASE_URL` Used to specify the base api url for all fetch requests.
