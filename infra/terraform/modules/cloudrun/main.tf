variable "name" {
  type = string
}

variable "region" {
  type = string
}

variable "service_account_email" {
  type = string
}

variable "min_instances" {
  type    = number
  default = 0
}

variable "max_instances" {
  type    = number
  default = 4
}

variable "plain_env" {
  description = "Variables de entorno no sensibles."
  type        = map(string)
  default     = {}
}

variable "secret_env" {
  description = "Mapa ENV_VAR => secret_id. Agregar solo cuando el secreto ya tenga una versión cargada."
  type        = map(string)
  default     = {}
}

resource "google_cloud_run_v2_service" "this" {
  name                = var.name
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_ALL" # Firebase Hosting llama a Cloud Run por internet
  deletion_protection = true

  template {
    service_account = var.service_account_email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      # Imagen placeholder: el pipeline de GitHub Actions despliega la real.
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        cpu_idle = true
      }

      dynamic "env" {
        for_each = var.plain_env
        content {
          name  = env.key
          value = env.value
        }
      }

      dynamic "env" {
        for_each = var.secret_env
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value
              version = "latest"
            }
          }
        }
      }
      # Startup probe TCP por defecto: funciona también con la imagen placeholder.
    }
  }

  # El pipeline controla imagen y tráfico; Terraform no debe revertirlos.
  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      template[0].revision,
      template[0].labels,
      traffic,
      client,
      client_version,
    ]
  }
}

# Sitio público. Si la organización tiene "Domain restricted sharing",
# se requiere una excepción de política para allUsers en este proyecto.
resource "google_cloud_run_v2_service_iam_member" "public" {
  name     = google_cloud_run_v2_service.this.name
  location = google_cloud_run_v2_service.this.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "url" {
  value = google_cloud_run_v2_service.this.uri
}
