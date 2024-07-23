resource "google_sql_database_instance" "instance" {
  name             = var.instance_name
  database_version = var.database_version
  region           = var.region

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_size         = var.disk_size
    disk_type         = var.disk_type

    ip_configuration {
      ipv4_enabled       = var.ip_configuration.ipv4_enabled
      private_network    = var.ip_configuration.private_network
      allocated_ip_range = var.ip_configuration.allocated_ip_range
    }

    backup_configuration {
      enabled                        = var.backup_configuration.enabled
      start_time                     = var.backup_configuration.start_time
      location                       = var.backup_configuration.location
      point_in_time_recovery_enabled = var.backup_configuration.point_in_time_recovery_enabled
      transaction_log_retention_days = var.backup_configuration.transaction_log_retention_days
    }

    dynamic "database_flags" {
      for_each = var.database_flags
      content {
        name  = database_flags.value.name
        value = database_flags.value.value
      }
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.instance.name
  project  = var.project_id
}

resource "google_sql_user" "users" {
  name     = var.db_username
  instance = google_sql_database_instance.instance.name
  password = var.db_password
  project  = var.project_id
}
