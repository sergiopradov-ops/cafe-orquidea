variable "region" {
  type = string
}

variable "repository_id" {
  type    = string
  default = "web"
}

resource "google_artifact_registry_repository" "this" {
  location      = var.region
  repository_id = var.repository_id
  format        = "DOCKER"
  description   = "Imágenes de la app web de Café Orquídea"

  cleanup_policy_dry_run = false

  cleanup_policies {
    id     = "keep-last-15"
    action = "KEEP"
    most_recent_versions {
      keep_count = 15
    }
  }

  cleanup_policies {
    id     = "delete-older-30d"
    action = "DELETE"
    condition {
      older_than = "2592000s"
    }
  }
}

output "repository_id" {
  value = google_artifact_registry_repository.this.repository_id
}
