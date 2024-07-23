# Auth Service

## Description

This service is responsible for managing the authentication of users.

## Prerequisites

```bash
# Install dependencies
npm install

## Copy the .env.development file and rename it to .env
cp .env.development .env

## Set the environment variables in the .env file
## Example:
PORT=8000

API_VERSION=v1

JWT_TOKEN=token1
GATEWAY_JWT_TOKEN=token2

CLIENT_URL=http://localhost:3000
API_GATEWAY_URL=http://localhost:8001

RABBITMQ_ENDPOINT=amqp://loginhub:loginhub@localhost:5672

DATABASE_HOST=localhost
DATABASE_USER=loginhub
DATABASE_PASSWORD=loginhub
DATABASE_NAME=loginhub_auth
DATABASE_PORT=5432

CLUSTER_TYPE=local
```

## Scripts

- `npm start`: Start the service in production mode.
- `npm run dev`: Start the service in development mode.
- `npm run test`: Run the tests.
- `npm run lint`: Lint the code.
- `npm run format`: Format the code.

## Endpoints

|             Endpoint              | Method |           Description            |
|:---------------------------------:|:------:|:--------------------------------:|
|           /api/healthy            |  Get   | Check if the service is running. |
|        /api/v1/auth/signup        |  POST  |           Signup user            |
|        /api/v1/auth/signin        |  POST  |           Signin user            |
| /api/v1/gateway/auth/verify-email |  PUT   |        Verify user email         |

## Docker

We can build a Docker image and push it to the Docker Hub.

```bash
# Login to Docker Hub
docker login

# Build the Docker image
docker image build -t <username>/loginhub-1-gateway .

# Tag the Docker image
docker tag <username>/loginhub-1-gateway <username>/loginhub-1-gateway:stable

# Push the Docker image
docker push <username>/loginhub-1-gateway:stable
```

We can build a Docker image and push it to the Google Artifact Registry.

```bash
# gcloud auth login
gcloud auth login
gcloud auth configure-docker asia-east1-docker.pkg.dev

# Build the Docker image
docker build -t loginhub-3-auth .

# Tag the Docker image
docker tag loginhub-3-auth <location>-docker.pkg.dev/<project_id>/<repo_id>/loginhub-3-auth:stable

docker tag loginhub-3-auth asia-east1-docker.pkg.dev/loginhub-dev/main-repo/loginhub-3-auth:stable

# Push the Docker image
docker push <location>-docker.pkg.dev/<project_id>/<repo_id>/loginhub-3-auth:stable

docker push asia-east1-docker.pkg.dev/loginhub-dev/main-repo/loginhub-3-auth:stable
```
