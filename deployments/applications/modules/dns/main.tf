resource "google_project_service" "cloud_domains" {
  service = "domains.googleapis.com"
}

resource "time_sleep" "wait_for_services" {
  depends_on = [
    google_project_service.cloud_domains
  ]

  create_duration = "60s"
}

resource "google_clouddomains_registration" "my_registration" {
  count = var.is_registered ? 0 : 1

  domain_name = var.domain
  location    = "global"
  yearly_price {
    currency_code = "USD"
    units         = var.domain_price
  }
  dns_settings {
    custom_dns {
      name_servers = [
        "ns-cloud-a1.googledomains.com.",
        "ns-cloud-a2.googledomains.com.",
        "ns-cloud-a3.googledomains.com.",
        "ns-cloud-a4.googledomains.com."
      ]
    }
  }
  contact_settings {
    privacy = "REDACTED_CONTACT_DATA"
    registrant_contact {
      phone_number = var.phone_number
      email        = var.email
      postal_address {
        region_code         = var.region_code
        postal_code         = "95050"
        administrative_area = "CA"
        locality            = "Example City"
        address_lines       = ["1234 Example street"]
        recipients          = ["example recipient"]
      }
    }
    admin_contact {
      phone_number = var.phone_number
      email        = var.email
      postal_address {
        region_code         = var.region_code
        postal_code         = "95050"
        administrative_area = "CA"
        locality            = "Example City"
        address_lines       = ["1234 Example street"]
        recipients          = ["example recipient"]
      }
    }
    technical_contact {
      phone_number = var.phone_number
      email        = var.email
      postal_address {
        region_code         = var.region_code
        postal_code         = "95050"
        administrative_area = "CA"
        locality            = "Example City"
        address_lines       = ["1234 Example street"]
        recipients          = ["example recipient"]
      }
    }
  }

  depends_on = [time_sleep.wait_for_services]
}

resource "google_dns_managed_zone" "default" {
  name     = "dns-zone"
  dns_name = "${var.domain}."

  depends_on = [time_sleep.wait_for_services, google_clouddomains_registration.my_registration]
}

resource "google_dns_record_set" "default" {
  managed_zone = google_dns_managed_zone.default.name
  name         = "${var.domain}."
  type         = "A"
  ttl          = 300
  rrdatas      = [var.load_balancer_ip_address]
}
