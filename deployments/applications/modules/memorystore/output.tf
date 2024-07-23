output "host" {
  description = "The host of the Redis instance"
  value       = google_redis_instance.cache.host
}

output "port" {
  description = "The port of the Redis instance"
  value       = google_redis_instance.cache.port
}
