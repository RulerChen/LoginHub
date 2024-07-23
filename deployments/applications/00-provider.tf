terraform {
  required_version = ">= 1.9"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.37.0"
    }
  }
  backend "gcs" {
    # bucket = "loginhub-tfstate-bucket-dev"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
}

# terraform init -reconfigure -backend-config="bucket=loginhub-tfstate-bucket-dev"
