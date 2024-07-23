variable "project_id" {
  description = "The project ID to deploy to"
  type        = string
}

variable "region" {
  description = "The region of the Cloud SQL resources"
  type        = string
}

variable "network_id" {
  description = "The network to deploy the Cloud SQL instance to"
  type        = string
}

variable "instance_name" {
  description = "The name of the Cloud SQL instance"
  type        = string
  default     = "main-cloudsql"
}

variable "database_version" {
  description = "The database version to use"
  type        = string
  default     = "POSTGRES_13"
}

variable "tier" {
  description = "The machine type to use"
  type        = string
  default     = "db-f1-micro"
}

variable "availability_type" {
  description = "The availability type of the Cloud SQL instance, high availability (REGIONAL) or single zone (ZONAL)"
  type        = string
  default     = "ZONAL"
}

variable "disk_size" {
  description = "The disk size of the Cloud SQL instance"
  type        = number
  default     = 10
}

variable "disk_type" {
  description = "The disk type of the Cloud SQL instance"
  type        = string
  default     = "PD_SSD"
}

variable "ip_configuration" {
  description = "The ip configuration for the Cloud SQL instance"
  type = object({
    ipv4_enabled       = bool
    private_network    = string
    allocated_ip_range = string
  })
}

variable "backup_configuration" {
  description = "The backup_configuration settings for the database"
  type = object({
    enabled                        = bool
    start_time                     = string
    location                       = string
    point_in_time_recovery_enabled = bool
    transaction_log_retention_days = number
  })
}

variable "maintenance_window_day" {
  description = "Day of week (1-7), starting on Monday, on which maintenance can occur"
  type        = number
  default     = 1
}

variable "maintenance_window_hour" {
  description = "Hour of day (0-23) on which maintenance can occur"
  type        = number
  default     = 23
}

variable "maintenance_window_update_track" {
  description = "Receive updates earlier (canary) or later (stable)"
  type        = string
  default     = "stable"
}

variable "database_flags" {
  description = "List of Cloud SQL flags that are applied to the database server"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "deletion_protection" {
  description = "Used to block Terraform from deleting a SQL Instance"
  type        = bool
  default     = false
}

variable "db_name" {
  description = "The name of the default database to create"
  type        = string
}

variable "db_username" {
  description = "The name of the default user"
  type        = string
}

variable "db_password" {
  description = "The password for the default user. If not set, a random one will be generated and available in the generated_user_password output variable."
  type        = string
}
