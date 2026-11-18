output "wif_provider" {
  description = "Valor para la variable de GitHub WIF_PROVIDER."
  value       = module.iam.wif_provider_name
}

output "deployer_sa" {
  description = "Valor para la variable de GitHub DEPLOYER_SA."
  value       = module.iam.deployer_sa_email
}

output "runtime_sa" {
  value = module.iam.runtime_sa_email
}

output "web_url" {
  description = "URL directa de Cloud Run (el dominio público va por Firebase Hosting)."
  value       = module.web.url
}

output "recaptcha_site_key" {
  description = "Valor para la variable de GitHub RECAPTCHA_SITE_KEY (pública)."
  value       = google_recaptcha_enterprise_key.web.name
}

output "image_repository" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${module.registry.repository_id}"
}
