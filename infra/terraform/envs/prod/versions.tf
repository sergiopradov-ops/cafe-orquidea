terraform {
  required_version = ">= 1.9"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.0, < 8.0"
    }
  }

  # Configuración parcial: el bucket se pasa en init
  #   terraform init -backend-config="bucket=<PROJECT_ID>-tfstate"
  # (scripts/bootstrap-gcp.sh lo hace automáticamente)
  backend "gcs" {
    prefix = "envs/prod"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
