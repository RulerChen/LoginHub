variable "project_id" {
  type        = string
  description = "The project ID to host the network in"
}

variable "region" {
  type        = string
  description = "The region to use"
}

variable "network_name" {
  type        = string
  description = "The name of the network"
  default     = "private-network"
}

variable "subnet_cidr" {
  type        = string
  description = "The CIDR range for the subnet"
  default     = "10.0.0.0/24"
}
