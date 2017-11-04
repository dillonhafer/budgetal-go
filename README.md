# Budgetal

A Budgetal implementation written in Go with Create React App on the
frontend

## Setup

Once the repo has been cloned start the dev server:

```
$ buffalo db migrate
$ buffalo dev
```

## Configuration

1. `PORT` the listening address can be configured by setting the `PORT` env var
2. `DATABASE_URL` the database connection can be configured by setting the `DATABASE_URL` env var
3. `CORS` space separated list of domains, defaults to `http://localhost:3001`

**The front end needs certain `ENV` vars at build time:**

1. `REACT_APP_HELP_FRAME` Used to populate the iframe in the help modal.
2. `REACT_APP_BASE_URL` Used to specify the base api url for all fetch requests.