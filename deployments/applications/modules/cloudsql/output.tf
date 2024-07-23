output "instance_name" {
  value       = google_sql_database_instance.instance.name
  description = "The name of the database instance"
}

output "instance_connection_name" {
  value       = google_sql_database_instance.instance.connection_name
  description = "The connection name of the instance to be used in connection strings"
}

output "private_ip_address" {
  description = "The private IP address of the instance"
  value       = google_sql_database_instance.instance.private_ip_address
}

output "database_name" {
  value       = google_sql_database.database.name
  description = "The name of the default database"
}

output "db_user" {
  value       = google_sql_user.users.name
  description = "The name of the default user"
}

output "db_password" {
  value       = google_sql_user.users.password
  description = "The password for the default user"
  sensitive   = true
}
