# Introduction

media-club-api is a Rust project that implements an AWS Lambda function in Rust.

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Cargo Lambda](https://www.cargo-lambda.info/guide/installation.html)
- [Make](https://www.gnu.org/software/make)
- [Docker](https://www.docker.com/)

### Database connection
In order to fully use the api, you must be running the dynamodb instance on your local computer with the application tables seeded.

At the moment due to security concerns, seeding requires having scanned JSON snapshot files of the tables. Please reach out to me (@Bmoel) to help get this data.

## Application Setup
In order to test the application locally, you will need to do the following
1) Turn on Docker for your OS
2) Run `make start`
   - This will start DynamoDB Local in Docker, seed all tables, and launch the local Lambda server in one step
3) Start development server for frontend application. Read [here](https://github.com/Bmoel/media-club/tree/main/apps/web-ui) for more details
4) Navigate to `http://localhost:5173/` to see the application

### Individual commands
If you need to run steps separately:

```bash
make db      # Start DynamoDB Local in Docker
make seed    # Seed all tables (or pass TABLES="t1 t2" to seed specific ones)
make dev     # Start the local Lambda server
```

## Testing API

If you want to run integration tests locally, you can use `cargo lambda watch`

First, run `cargo lambda watch` to start a local server. When you make changes to the code, the server will automatically restart.

Second, you'll need a way to pass the event data to the lambda function.

For HTTP events, you can also call the function directly with cURL or any other HTTP client. For example:

```bash
curl http://localhost:9000/lambda-url/media-club-api/endpoint
```
You can use the makefile `query` command to more easily query the running api
```bash
make query URL=endpoint
```

## Building

Note, building will mostly not likely work on Windows unless you have the right dependencies. Would recommend building on linux (I personally use WSL for this)

Not needed for development due to its relation to [Deploying](#deploying). Please reach out to @Bmoel if there are any concerns about new dependencies and building them for production

Read more about building your lambda function in [the Cargo Lambda documentation](https://www.cargo-lambda.info/commands/build.html).

## Deploying

Do not try and deploy to this project since you do not have permission. Please reach out to @Bmoel to approve any new Pull Requests and building/deploying will be handled then

Read more about deploying your lambda function in [the Cargo Lambda documentation](https://www.cargo-lambda.info/commands/deploy.html).

## Extra
Read more about running the local server in [the Cargo Lambda documentation for the `watch` command](https://www.cargo-lambda.info/commands/watch.html).