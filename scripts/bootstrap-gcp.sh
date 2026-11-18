#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Bootstrap de Café Orquídea en GCP (se corre UNA vez, en Cloud Shell).
#
#   git clone https://github.com/<owner>/cafe-orquidea && cd cafe-orquidea
#   ./scripts/bootstrap-gcp.sh
#
# Hace todo lo siguiente (es idempotente: se puede volver a correr):
#   1. Crea el proyecto y lo liga a la cuenta de facturación
#   2. Crea el bucket de estado de Terraform
#   3. terraform apply (APIs, Artifact Registry, SAs, WIF, Cloud Run,
#      Secret Manager, reCAPTCHA, uptime check)
#   4. Carga el secreto de Resend (o "pending" si aún no hay llave)
#   5. Configura las variables del repo en GitHub y dispara el primer deploy
#   6. Agrega Firebase al proyecto y despliega Firebase Hosting
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TF_DIR="${ROOT_DIR}/infra/terraform/envs/prod"
REGION="us-central1"

bold() { printf '\n\033[1m%s\033[0m\n' "$*"; }
ask() { # ask VAR "Pregunta" "default"
  local var="$1" prompt="$2" default="${3:-}" value
  if [[ -n "${!var:-}" ]]; then return; fi
  # NONINTERACTIVE=1: usa el default sin preguntar (tutorial de Cloud Shell / CI).
  if [[ "${NONINTERACTIVE:-0}" == "1" ]]; then printf -v "$var" '%s' "$default"; return; fi
  read -r -p "${prompt}${default:+ [${default}]}: " value
  printf -v "$var" '%s' "${value:-$default}"
}

export CLOUDSDK_CORE_DISABLE_PROMPTS=1

command -v gcloud >/dev/null || { echo "Falta gcloud."; exit 1; }

# Cloud Shell ya no trae Terraform: se instala en ~/bin si no hay uno real.
if ! terraform version 2>/dev/null | grep -q '^Terraform v'; then
  TF_VERSION="$(curl -fsSL https://checkpoint-api.hashicorp.com/v1/check/terraform | sed -E 's/.*"current_version":"([^"]+)".*/\1/')"
  echo "Instalando Terraform ${TF_VERSION} en ~/bin"
  mkdir -p "$HOME/bin"
  curl -fsSL -o /tmp/terraform.zip "https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_amd64.zip"
  unzip -o -q /tmp/terraform.zip terraform -d "$HOME/bin"
  export PATH="$HOME/bin:$PATH"
fi
terraform version | head -1

bold "Datos del proyecto"
DEFAULT_REPO="$(git -C "$ROOT_DIR" config --get remote.origin.url 2>/dev/null | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##' || true)"
ask GITHUB_REPO "Repositorio GitHub (owner/repo)" "$DEFAULT_REPO"
ask PROJECT_ID "ID del proyecto GCP (único global)" "orquidea-prod-$(head -c 2 /dev/urandom | od -An -tx1 | tr -d ' \n')"
# Si el proyecto ya tiene facturación, se reutiliza esa cuenta.
if [[ -z "${BILLING_ACCOUNT:-}" ]] && gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  CURRENT_BILLING="$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingAccountName)' 2>/dev/null || true)"
  [[ -n "$CURRENT_BILLING" ]] && BILLING_ACCOUNT="${CURRENT_BILLING#billingAccounts/}"
fi
if [[ -z "${BILLING_ACCOUNT:-}" ]]; then
  gcloud billing accounts list --filter=open=true --format="table(name,displayName)" || true
  if [[ "${NONINTERACTIVE:-0}" == "1" ]]; then echo "Falta BILLING_ACCOUNT y el proyecto no tiene facturación."; exit 1; fi
fi
ask BILLING_ACCOUNT "Billing account ID (XXXXXX-XXXXXX-XXXXXX)"
ask DOMAIN "Dominio del sitio (vacío si aún no hay)" ""
ask LEADS_INBOX_EMAIL "Correo que recibe solicitudes de catering/foodtruck"
ask CONTACT_EMAIL "Correo de contacto visible en el sitio" "$LEADS_INBOX_EMAIL"
ask WHATSAPP_NUMBER "WhatsApp (formato 521XXXXXXXXXX)" ""
ask RESEND_API_KEY "Resend API key (vacío = después)" ""

if [[ -n "$DOMAIN" ]]; then
  SITE_URL="https://${DOMAIN}"
  DOMAINS_HCL="[\"${DOMAIN}\", \"www.${DOMAIN}\", \"${PROJECT_ID}.web.app\", \"${PROJECT_ID}.firebaseapp.com\"]"
else
  SITE_URL="https://${PROJECT_ID}.web.app"
  DOMAINS_HCL="[\"${PROJECT_ID}.web.app\", \"${PROJECT_ID}.firebaseapp.com\"]"
fi

bold "1/6 Proyecto y facturación"
if ! gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  gcloud projects create "$PROJECT_ID" --name="Cafe Orquidea Prod"
fi
gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING_ACCOUNT" >/dev/null
gcloud config set project "$PROJECT_ID" >/dev/null
# Habilitar todas las APIs de una vez (evita prompts de gcloud más adelante).
gcloud services enable storage.googleapis.com cloudresourcemanager.googleapis.com \
  serviceusage.googleapis.com secretmanager.googleapis.com run.googleapis.com \
  artifactregistry.googleapis.com iam.googleapis.com iamcredentials.googleapis.com \
  sts.googleapis.com firebase.googleapis.com firebasehosting.googleapis.com \
  recaptchaenterprise.googleapis.com monitoring.googleapis.com logging.googleapis.com

bold "2/6 Bucket de estado de Terraform"
BUCKET="gs://${PROJECT_ID}-tfstate"
if ! gcloud storage buckets describe "$BUCKET" >/dev/null 2>&1; then
  gcloud storage buckets create "$BUCKET" --location="$REGION" \
    --uniform-bucket-level-access --public-access-prevention
  gcloud storage buckets update "$BUCKET" --versioning
fi

bold "3/6 Terraform"
cat > "${TF_DIR}/terraform.tfvars" <<EOF
project_id        = "${PROJECT_ID}"
region            = "${REGION}"
github_repository = "${GITHUB_REPO}"
site_domains      = ${DOMAINS_HCL}
leads_inbox_email = "${LEADS_INBOX_EMAIL}"
EOF
# Copia del tfvars en el bucket de estado (no está en git).
gcloud storage cp "${TF_DIR}/terraform.tfvars" "${BUCKET}/config/terraform.tfvars" >/dev/null

cd "$TF_DIR"
terraform init -input=false -reconfigure -backend-config="bucket=${PROJECT_ID}-tfstate"
# Primero APIs y secretos: Cloud Run necesita que el secreto tenga una versión.
terraform apply -input=false -auto-approve \
  -target=google_project_service.apis \
  -target=google_secret_manager_secret.app

bold "4/6 Secretos"
if [[ -n "$RESEND_API_KEY" ]]; then
  printf '%s' "$RESEND_API_KEY" | gcloud secrets versions add resend-api-key --data-file=- >/dev/null
  echo "resend-api-key cargado."
elif [[ -z "$(gcloud secrets versions list resend-api-key --filter=state=enabled --format='value(name)' --limit=1)" ]]; then
  printf 'pending' | gcloud secrets versions add resend-api-key --data-file=- >/dev/null
  echo "resend-api-key = pending (los correos se escriben en el log hasta cargar la llave real)."
fi

# Recuperación: si una creación previa de Cloud Run falló, queda "tainted" y
# con deletion_protection=true en el estado; se elimina y se vuelve a crear.
WEB_ADDR="module.web.google_cloud_run_v2_service.this"
if terraform state show "$WEB_ADDR" 2>/dev/null | head -1 | grep -q tainted; then
  echo "Cloud Run 'web' quedó en estado fallido: se elimina para recrearlo."
  terraform state rm "$WEB_ADDR"
  gcloud run services delete web --region "$REGION" --quiet || true
fi

# Los permisos IAM recién creados tardan en propagarse: hasta 3 intentos.
for attempt in 1 2 3; do
  if terraform apply -input=false -auto-approve; then break; fi
  [[ $attempt == 3 ]] && exit 1
  echo "Reintentando en 30 s (intento $((attempt + 1))/3)…"
  sleep 30
  if terraform state show "$WEB_ADDR" 2>/dev/null | head -1 | grep -q tainted; then
    terraform state rm "$WEB_ADDR"
    gcloud run services delete web --region "$REGION" --quiet || true
  fi
done

WIF_PROVIDER="$(terraform output -raw wif_provider)"
DEPLOYER_SA="$(terraform output -raw deployer_sa)"
RECAPTCHA_SITE_KEY="$(terraform output -raw recaptcha_site_key)"
RUN_URL="$(terraform output -raw web_url)"
cd "$ROOT_DIR"

bold "5/6 Variables de GitHub"
declare -A GH_VARS=(
  [GCP_PROJECT_ID]="$PROJECT_ID"
  [WIF_PROVIDER]="$WIF_PROVIDER"
  [DEPLOYER_SA]="$DEPLOYER_SA"
  [SITE_URL]="$SITE_URL"
  [CONTACT_EMAIL]="$CONTACT_EMAIL"
  [WHATSAPP_NUMBER]="$WHATSAPP_NUMBER"
  [RECAPTCHA_SITE_KEY]="$RECAPTCHA_SITE_KEY"
)
if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  gh api -X PUT "repos/${GITHUB_REPO}/environments/production" >/dev/null
  for k in "${!GH_VARS[@]}"; do
    gh variable set "$k" --repo "$GITHUB_REPO" --body "${GH_VARS[$k]}"
  done
  gh workflow run deploy.yml --repo "$GITHUB_REPO" --ref main && echo "Deploy disparado."
else
  echo "gh no está autenticado (corre 'gh auth login' y vuelve a ejecutar este script),"
  echo "o crea estas variables en GitHub → Settings → Secrets and variables → Actions → Variables:"
  for k in "${!GH_VARS[@]}"; do printf '  %-20s %s\n' "$k" "${GH_VARS[$k]}"; done
fi

bold "6/6 Firebase Hosting"
FIREBASE="npx -y firebase-tools@latest"
$FIREBASE projects:addfirebase "$PROJECT_ID" >/dev/null 2>&1 || true
printf '{\n  "projects": {\n    "default": "%s"\n  }\n}\n' "$PROJECT_ID" > "${ROOT_DIR}/.firebaserc"
if ! $FIREBASE deploy --only hosting --project "$PROJECT_ID" --non-interactive; then
  echo "Si falló por autenticación: ${FIREBASE} login --no-localhost  y vuelve a correr el script."
fi

bold "Listo"
cat <<EOF
  Cloud Run:         ${RUN_URL}
  Sitio (Firebase):  https://${PROJECT_ID}.web.app
  Repo:              https://github.com/${GITHUB_REPO}/actions

Pendientes manuales:
  - Dominio: Firebase console → Hosting → "Agregar dominio personalizado" (${DOMAIN:-cuando exista}).
  - Resend: verificar el dominio y cargar la llave:
      printf '%s' "<KEY>" | gcloud secrets versions add resend-api-key --data-file=- --project ${PROJECT_ID}
    y redeploy (gh workflow run deploy.yml).
  - Commit de .firebaserc si cambió.
EOF
