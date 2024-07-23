# enable the redis service
resource "google_project_service" "redis" {
  service = "redis.googleapis.com"
}
resource "time_sleep" "wait_for_services" {
  depends_on = [google_project_service.redis]

  create_duration = "60s"
}

# create a Redis instance
resource "google_redis_instance" "cache" {
  name           = var.name
  memory_size_gb = var.memory_size_gb

  tier          = var.tier
  region        = var.region
  redis_version = var.redis_version

  authorized_network = var.network_id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"

  persistence_config {
    persistence_mode    = "RDB"
    rdb_snapshot_period = "TWENTY_FOUR_HOURS"
  }

  depends_on = [time_sleep.wait_for_services]
}
