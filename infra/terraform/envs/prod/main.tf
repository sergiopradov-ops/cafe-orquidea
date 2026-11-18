locals {
  apis = [
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "recaptchaenterprise.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
  ]
}

resource "google_project_service" "apis" {
  for_each           = toset(local.apis)
  service            = each.value
  disable_on_destroy = false
}

module "registry" {
  source     = "../../modules/registry"
  region     = var.region
  depends_on = [google_project_service.apis]
}

module "iam" {
  source            = "../../modules/iam"
  project_id        = var.project_id
  github_repository = var.github_repository
  registry_id       = module.registry.repository_id
  registry_location = var.region
  depends_on        = [google_project_service.apis]
}

resource "google_secret_manager_secret" "app" {
  for_each  = toset(values(var.secret_env))
  secret_id = each.value

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

# Acceso por secreto (no a nivel proyecto): mínimo privilegio.
resource "google_secret_manager_secret_iam_member" "runtime_access" {
  for_each  = google_secret_manager_secret.app
  secret_id = each.value.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.iam.runtime_sa_email}"
}

# reCAPTCHA Enterprise (score-based) para los formularios.
resource "google_recaptcha_enterprise_key" "web" {
  display_name = "cafe-orquidea-web"

  web_settings {
    integration_type  = "SCORE"
    allow_all_domains = false
    allowed_domains   = var.site_domains
  }

  depends_on = [google_project_service.apis]
}

# El runtime crea assessments con su propia identidad (sin API key).
resource "google_project_iam_member" "runtime_recaptcha" {
  project = var.project_id
  role    = "roles/recaptchaenterprise.agent"
  member  = "serviceAccount:${module.iam.runtime_sa_email}"
}

module "web" {
  source                = "../../modules/cloudrun"
  name                  = "web"
  region                = var.region
  service_account_email = module.iam.runtime_sa_email
  min_instances         = var.min_instances
  max_instances         = 4
  secret_env            = var.secret_env

  plain_env = {
    GCP_PROJECT_ID    = var.project_id
    LEADS_INBOX_EMAIL = var.leads_inbox_email
    EMAIL_FROM        = var.email_from
  }

  depends_on = [
    google_project_service.apis,
    google_secret_manager_secret_iam_member.runtime_access,
  ]
}

# Uptime check sobre /api/health (alertas se agregan en Sprint 7).
resource "google_monitoring_uptime_check_config" "web_health" {
  display_name = "web /api/health"
  timeout      = "10s"
  period       = "300s"

  http_check {
    path         = "/api/health"
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = trimprefix(module.web.url, "https://")
    }
  }

  depends_on = [google_project_service.apis]
}
