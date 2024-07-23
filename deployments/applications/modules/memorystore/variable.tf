variable "project_id" {
  type        = string
  description = "The project ID to host the memorystore in"
}

variable "region" {
  type        = string
  description = "The region to use"
}

variable "name" {
  type        = string
  description = "The name of the memorystore instance"
  default     = "my-memorystore"
}

variable "memory_size_gb" {
  type        = number
  description = "The memory size of the instance in GB"
  default     = 1
}

variable "tier" {
  type        = string
  description = "The service tier of the instance"
  default     = "BASIC"
}

variable "redis_version" {
  type        = string
  description = "The version of Redis software"
  default     = "REDIS_7_X"
}

variable "network_id" {
  type        = string
  description = "The name of the network to connect the instance to"
}
