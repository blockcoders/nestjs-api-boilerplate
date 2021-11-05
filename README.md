# NestJS Api Boilerplate

REST API NestJS Quick Start

## Environment setup

 - Install [Node.js](https://nodejs.org/)
   - Recommended method is by using [NVM](https://github.com/creationix/nvm)
   - Recommended Node.js version is v14.17
 - Install [Docker](https://docs.docker.com/get-docker/)

## Get Started

Install all the dependencies:

```
npm ci
```

Copy the `.env.sample` file to `.env`

```
cp .env.sample .env
```

In the project directory, you can run:

### `npm run start:dev`

Runs the NodeJs services in the development mode.\
Open [localhost:8080/api/v1/ping](http://localhost:8080/api/v1/ping) to view it in the browser or Postman.

The service will reload if you make edits.

## Test

### `npm run test`

Running the unit tests.

### `npm run test:cov`

Running the test coverage.
