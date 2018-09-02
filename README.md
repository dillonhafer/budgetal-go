# Budgetal

A Budgetal implementation written in Go with Create React App on the
web frontend and a fully-functional iOS and Android app written with Create React Native App

## Setup

**Backend setup**:

[Install buffalo](https://gobuffalo.io/docs/installation#basic-installation) then install Budgetal

```sh
$ git clone https://github.com/dillonhafer/budgetal-go.git
$ cd backend
$ buffalo db create
$ buffalo db migrate
$ buffalo dev
```

**Frontend setup**:

```
cd frontend
yarn install
yarn start
```

**Mobile setup**:

Mobile is an [Expo](https://expo.io) app

```
cd mobile
yarn install
yarn start
```

**iTerm automation**

If you are using iTerm and/or Visual Studio Code, there is a Task/AppleScript to start all
the servers for you. Simply run the task `budgetal-servers`

You can manually run the AppleScript with the following (if using another editor):

```sh
#!/bin/bash
project=/my/path/to/budgetal-go
$project/.vscode/./budgetal-servers $project
```

## Configuration

1. `PORT` the port can be configured by setting the `PORT` env var
2. `ADDR` the listening address can be configured by setting the `ADDR` env var
3. `DATABASE_URL` the database connection can be configured by setting the `DATABASE_URL` env var
4. `CORS` space separated list of domains, defaults to `http://localhost:3001`
5. `BUDGETAL_HEADER` name of header used when authenticating, defaults to `X-Budgetal-Session`
6. `BUDGETAL_COOKIE` name of cookie used when authenticating, defaults to `_budgetal_session`

**S3 Credentials**

Providing S3 credentials will auto-matically use S3 to store avatars:

1. `AWS_S3_ACCESS_KEY_ID`
2. `AWS_S3_SECRET_ACCESS_KEY`
3. `AWS_S3_TOKEN`
4. `AWS_S3_REGION`
5. `AWS_S3_BUCKET`

**Production will also need the following:**

1. `GO_ENV` application run-time environment, usually `production`
2. `SMTP_USER` username for smtp service
3. `SMTP_PASSWORD` password for smtp service
4. `SMTP_HOST` host for smtp service
5. `SMTP_PORT` port for smtp service
6. `ERROR_NOTIFICATION_EMAILS` comma-separated list of emails to receive 500 errors

**The front end needs certain `ENV` vars at build time:**

1. `REACT_APP_HELP_FRAME` Used to populate the iframe in the help modal.
2. `REACT_APP_BASE_URL` Used to specify the base api url for all fetch requests.

## Tests

How to run the backend tests:

```
$ buffalo test
```

## Deploying

See [`grifts/deploy.go`](backend/grifts/deploy.go) for configuration details.

1. Backend deploy (heroku): `cd backend && buffalo task release`
2. Frontend deploy (firebase): `cd frontend && yarn release`
