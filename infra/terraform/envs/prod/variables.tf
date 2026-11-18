variable "project_id" {
  description = "ID del proyecto de GCP de producción."
  type        = string
}

variable "region" {
  description = "Región de Cloud Run y Artifact Registry. us-central1 es compatible con rewrites de Firebase Hosting."
  type        = string
  default     = "us-central1"
}

variable "github_repository" {
  description = "Repositorio autorizado a desplegar, formato owner/repo."
  type        = string
}

variable "secret_env" {
  description = "ENV_VAR => secret_id. Los valores se cargan con gcloud (nunca en Terraform); el bootstrap crea una versión 'pending' para que Cloud Run arranque."
  type        = map(string)
  default = {
    RESEND_API_KEY = "resend-api-key"
  }
}

variable "site_domains" {
  description = "Dominios donde se usa la llave de reCAPTCHA (ej. cafeorquidea.mx). Incluye también <project>.web.app."
  type        = list(string)
}

variable "leads_inbox_email" {
  description = "Buzón del cliente que recibe las solicitudes de catering y foodtruck."
  type        = string
}

variable "email_from" {
  description = "Remitente de correos (dominio verificado en Resend)."
  type        = string
  default     = "Café Orquídea <onboarding@resend.dev>"
}

variable "min_instances" {
  description = "0 en la Ola 1 (vitrina). Subir a 1 cuando haya checkout (Ola 2)."
  type        = number
  default     = 0
}
