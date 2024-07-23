# Gateway Service

## Description

This service is the entry point for the backend. It is responsible for routing requests to the appropriate service.

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

JWT_TOKEN=secret1
GATEWAY_JWT_TOKEN=secret2
SECRET_KEY=secret3

CLIENT_URL=http://localhost:3000
AUTH_BASE_URL=http://localhost:8003

REDIS_HOST=redis
REDIS_PORT=6379
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
|    /api/v1/gateway/auth/signup    |  POST  |           Signup user            |
|   /api/v1/gateway/auth/signout    |  POST  |           Signout user           |
|    /api/v1/gateway/auth/signin    |  POST  |           Signin user            |
| /api/v1/gateway/auth/verify-email |  PUT   |        Verify user email         |

## Docker

We can build a Docker image and push it to the DockerHub.

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
docker build -t loginhub-1-gateway .

# Tag the Docker image
docker tag loginhub-1-gateway <location>-docker.pkg.dev/<project_id>/<repo_id>/loginhub-1-gateway:stable

docker tag loginhub-1-gateway asia-east1-docker.pkg.dev/loginhub-dev/main-repo/loginhub-1-gateway:stable

# Push the Docker image
docker push <location>-docker.pkg.dev/<project_id>/<repo_id>/loginhub-1-gateway:stable

docker push asia-east1-docker.pkg.dev/loginhub-dev/main-repo/loginhub-1-gateway:stable
```
