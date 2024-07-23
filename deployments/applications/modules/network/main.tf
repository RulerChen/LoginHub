# enable the required services
resource "google_project_service" "compute" {
  service = "compute.googleapis.com"
}
resource "google_project_service" "service_networking" {
  service = "servicenetworking.googleapis.com"
}
resource "time_sleep" "wait_for_services" {
  depends_on = [
    google_project_service.compute,
    google_project_service.service_networking
  ]
  create_duration = "60s"
}

# create the network
resource "google_compute_network" "vpc_network" {
  name = var.network_name

  auto_create_subnetworks = false
  mtu                     = 1460
  depends_on              = [time_sleep.wait_for_services]
}

# create the subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.network_name}-subnet1"
  ip_cidr_range = var.subnet_cidr
  network       = google_compute_network.vpc_network.id

  region                   = var.region
  private_ip_google_access = true

  # create the secondary ranges for gke
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

# let vpc connect to cloudsql and memorystore
resource "google_compute_global_address" "private_ip_address" {
  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_network.id
}
# there is bug in terraform google_service_networking_connection. Please refer to https://github.com/hashicorp/terraform-provider-google/issues/16697
# you should leave the reserved_peering_ranges empty first, then run terraform apply, then add ip address and apply again
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
  # reserved_peering_ranges = []

  depends_on = [time_sleep.wait_for_services]
}

# allow all internal traffic
resource "google_compute_firewall" "allow_internal" {
  name    = "${var.network_name}-allow-internal"
  network = google_compute_network.vpc_network.name

  allow {
    protocol = "icmp"
  }
  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  source_ranges = [var.subnet_cidr]
}

# allow load balancer to gke health checks
resource "google_compute_firewall" "allow_health_check" {
  name      = "${var.network_name}-allow-health-check"
  network   = google_compute_network.vpc_network.name
  direction = "INGRESS"

  allow {
    protocol = "tcp"
    ports    = ["8000"]
  }
  # defaul gcp health check ip ranges
  source_ranges = [
    "130.211.0.0/22",
    "35.191.0.0/16"
  ]
  target_tags = ["gke-node"]
}

# let vm instances access the internet
resource "google_compute_router" "router" {
  name    = "${var.network_name}-router"
  network = google_compute_network.vpc_network.id

  region = var.region
}
resource "google_compute_router_nat" "nat" {
  name                               = "${var.network_name}-nat"
  router                             = google_compute_router.router.name
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  region                 = var.region
  nat_ip_allocate_option = "AUTO_ONLY"
}
