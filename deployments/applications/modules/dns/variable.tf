variable "domain" {
  type = string
}

variable "domain_price" {
  type = number
}

variable "is_registered" {
  type    = bool
  default = true
}

variable "load_balancer_ip_address" {
  type    = string
  default = ""
}

variable "email" {
  type = string
}

variable "phone_number" {
  type = string
}

variable "region_code" {
  type    = string
  default = "US"
}
