locals {
  env = var.workspace_env

  region = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["region"]
  zones  = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["zones"]

  # gcs
  frontend_bucket_name = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["frontend_bucket_name"]

  # gke
  cluster_name = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["cluster_name"]
  node_count   = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["node_count"]
  machine_type = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["machine_type"]
  disk_type    = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["disk_type"]
  disk_size    = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["disk_size"]

  # cloudsql
  cloud_sql_instance_name                = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["cloud_sql_instance_name"]
  database_version                       = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_version"]
  database_tier                          = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_tier"]
  databse_vailability_type               = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["databse_vailability_type"]
  database_disk_size                     = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_disk_size"]
  database_disk_type                     = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_disk_type"]
  database_backup_enable                 = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_backup_enable"]
  database_backup_start_time             = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_backup_start_time"]
  database_backup_point_in_time_recovery = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_backup_point_in_time_recovery"]
  database_backup_retention_period       = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_backup_retention_period"]
  database_flags                         = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_flags"]
  database_settings                      = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["database_settings"]

  # memorystore
  redis_instance_name = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["redis_instance_name"]
  redis_memory_size   = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["redis_memory_size"]
  redis_tier          = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["redis_tier"]
  redis_version       = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["redis_version"]

  # lb
  domain_name = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["domain_name"]
  neg_name    = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["neg_name"]
  neg_zone    = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["neg_zone"]
  enable_cdn  = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["enable_cdn"]

  # dns
  is_registered    = true # change this to false if you don't have a domain registered
  domain_price     = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["domain_price"]
  dns_email        = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["dns_email"]
  dns_phone_number = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["dns_phone_number"]
  dns_region_code  = jsondecode(file("${path.module}/infra/${var.workspace_env}.json"))["dns_region_code"]
}


module "network" {
  source = "./modules/network"

  project_id = var.project_id
  region     = local.region
}

module "gcs" {
  source = "./modules/gcs"

  location      = local.region
  workspace_env = local.env
  bucket_name   = local.frontend_bucket_name
}

module "gke" {
  source = "./modules/gke"

  project_id              = var.project_id
  region                  = local.region
  node_locations          = local.zones
  cluster_name            = local.cluster_name
  node_count              = local.node_count
  machine_type            = local.machine_type
  disk_type               = local.disk_type
  disk_size_gb            = local.disk_size
  network_self_link       = module.network.network_self_link
  subnet_self_link        = module.network.subnet_self_link
  subnet_secondary_ranges = module.network.subnet_secondary_ranges

  depends_on = [module.network]
}

module "cloudsql" {
  source = "./modules/cloudsql"

  project_id        = var.project_id
  region            = local.region
  network_id        = module.network.network_id
  instance_name     = local.cloud_sql_instance_name
  database_version  = local.database_version
  tier              = local.database_tier
  availability_type = local.databse_vailability_type
  disk_size         = local.database_disk_size
  disk_type         = local.database_disk_type
  ip_configuration = {
    ipv4_enabled       = false
    private_network    = module.network.network_id
    allocated_ip_range = null
  }
  backup_configuration = {
    enabled                        = local.database_backup_enable
    start_time                     = local.database_backup_start_time
    location                       = local.region
    point_in_time_recovery_enabled = local.database_backup_point_in_time_recovery
    transaction_log_retention_days = local.database_backup_retention_period
  }
  database_flags = local.database_flags
  db_name        = local.database_settings.name
  db_username    = local.database_settings.username
  db_password    = local.database_settings.password

  depends_on = [module.network]
}

module "memorystore" {
  source = "./modules/memorystore"

  project_id     = var.project_id
  region         = local.region
  name           = local.redis_instance_name
  memory_size_gb = local.redis_memory_size
  tier           = local.redis_tier
  redis_version  = local.redis_version
  network_id     = module.network.network_id

  depends_on = [module.network]
}

module "loadbalancer" {
  source = "./modules/lb"

  domain_name       = local.domain_name
  gcs_bucket_name   = module.gcs.bucket_name
  neg_name          = local.neg_name
  neg_zone          = local.neg_zone
  network_self_link = module.network.network_self_link
  subnet_self_link  = module.network.subnet_self_link
  cluster_name      = module.gke.cluster_name
  enable_cdn        = local.enable_cdn

  depends_on = [module.gcs, module.gke]
}

module "dns" {
  source = "./modules/dns"

  domain                   = local.domain_name
  domain_price             = local.domain_price
  is_registered            = local.is_registered
  load_balancer_ip_address = module.loadbalancer.load_balancer_ip
  email                    = local.dns_email
  phone_number             = local.dns_phone_number
  region_code              = local.dns_region_code

  depends_on = [module.loadbalancer]
}
