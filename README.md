
## Installation
Dependencies:
- NATS - https://nats.io/download/nats-io/nats-server/
```bash
$ npm install
```

## Running the app
Note: Be sure to run `nats-server` to make sure microservice communication is up and running.

Each command can be passed `-- NAME_OF_SERVICE` to start a microservice (app names match directories they are housed in)
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

