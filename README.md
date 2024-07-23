# LoginHub

## Description

LoginHub is a microservice-based application that provides authentication and authorization services for other applications.

## Tech Stack

<span>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/redis-CC0000.svg?&style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=for-the-badge&logo=terraform&logoColor=white)
![GCP](https://img.shields.io/badge/Google%20Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Github Actions](https://img.shields.io/badge/Github%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

</span>

## Features

- `User signup`: Allows users to sign up for an account.
- `User login`: Allows users to log in to their account.
- `User logout`: Allows users to log out of their account.
- `Verify email`: Allows users to verify their email address.

## Architecture

## Folder Structure

- `backend`: Contains the backend code for the application.
- `frontend`: Contains the frontend code for the application.
- `kubernetes`: Contains the Kubernetes configuration files for the application.
- `kubernetes/gcp`: Contains the GCP configuration files for the application.
- `kubernetes/local`: Contains the minikube configuration files for the application.
- `postman`: Contains the Postman collection for the application.
- `deployment`: Contains the terraform configuration files for the application.

## Todo List

- [ ] Oauth
- [ ] OTP
- [ ] SMS
- [ ] Frontend
- [ ] More boilerplate code

## Local Development

### Docker Compose

To run the application locally using Docker Compose, run the following command:

```bash
docker compose up -d
```

### MiniKube

Before running the application locally using MiniKube, make sure you have MiniKube installed, and also make sure you have pushed the Docker image to the DockerHub.

```bash
minikube start --driver=hyperv --insecure-registry "10.0.0.0/24"

minikube addons enable registry

# create production namespace
kubectl create namespace production

# apply all yaml file under ./kubernetes/local and change secrets
kubectl apply -f .
```

To enable the ingress controller, run the following command:

```bash
minikube addons enable ingress

minikube ip 

# add the following line to /etc/hosts
# <minikube ip> loginhub.com

minikube tunnel
```

To enable tls, run the following command:

```bash
# execute ./kubernetes/local/1-gateway/cert/generate_certs.sh

# apply loginhub.com.crt to keychain access

kubectl -n production create secret tls loginhub-tls --key loginhub.com.key --cert loginhub.com.crt

minikube addons configure ingress
# production/loginhub-tls 
# restart ingress
```

Finally, to access the application, open your browser and navigate to `https://loginhub.com`.

## GCP Deployment

Install GCLOUD and Terraform

```bash
# login to gcloud
gcloud auth application-default login
```

k8s

```bash
kubectl create namespace production
```
