# Café Orquídea

Sitio de Café Orquídea: panadería, catering y foodtruck. Next.js 16 + TypeScript + Tailwind v4 en Cloud Run (GCP), con Firebase Hosting como CDN y dominio.

> Estado: **Ola 1 (sitio vitrina)**. Ver `docs/adr/0002-lanzamiento-en-olas.md`.

## Desarrollo local

```bash
corepack enable
pnpm install            # genera pnpm-lock.yaml: haz commit de este archivo
cp .env.example .env.local
pnpm dev                # http://localhost:3000
```

Inicializar shadcn/ui (una vez) y agregar componentes según se necesiten:

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card input label textarea
```

Calidad: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Puesta en marcha en GCP (una sola vez)

Todo está automatizado en `scripts/bootstrap-gcp.sh`. Se corre en **Cloud Shell** (ya trae gcloud, terraform y gh):

```bash
gh auth login                      # una vez, para que el script configure GitHub
git clone https://github.com/<owner>/cafe-orquidea && cd cafe-orquidea
./scripts/bootstrap-gcp.sh
```

El script pide: repo, ID de proyecto, billing account, dominio (opcional), correo de solicitudes, WhatsApp y la llave de Resend (opcional). Después:

1. Crea el proyecto, lo liga a facturación y crea el bucket de estado `<PROJECT_ID>-tfstate`.
2. `terraform apply`: APIs, Artifact Registry, SAs, Workload Identity Federation, Cloud Run, Secret Manager, reCAPTCHA Enterprise y uptime check.
3. Carga `resend-api-key` (o `pending` si aún no hay llave; los correos quedan en el log).
4. Configura las variables del repo en GitHub y dispara el primer deploy.
5. Agrega Firebase al proyecto y despliega Hosting (`https://<PROJECT_ID>.web.app`).

Es idempotente: se puede volver a correr para cambiar datos. Si la organización aplica *Domain restricted sharing*, el binding `allUsers` de Cloud Run fallará y hay que pedir una excepción de política.

### Deploy continuo

Merge a `main` → CI → build/push → revisión sin tráfico → smoke test (`/api/health`, `/`, `/panaderia`) → 100%. Mientras no exista la variable `WIF_PROVIDER` el job de deploy se omite.

### Pendientes manuales

- **Dominio:** Firebase console → Hosting → *Agregar dominio personalizado* y registros DNS. El SSL se emite solo.
- **Resend:** verificar el dominio del cliente y cargar la llave:

  ```bash
  printf '%s' "<RESEND_API_KEY>" | gcloud secrets versions add resend-api-key --data-file=-
  gh workflow run deploy.yml
  ```

  Luego cambia `email_from` en `terraform.tfvars` a un remitente del dominio verificado.

### Terraform manual (después del bootstrap)

```bash
cd infra/terraform/envs/prod
gcloud storage cp gs://<PROJECT_ID>-tfstate/config/terraform.tfvars .
terraform init -backend-config="bucket=<PROJECT_ID>-tfstate"
terraform plan
```

## Estructura

Ver `CLAUDE.md`.

## Rollback

```bash
gcloud run revisions list --service web --region us-central1
gcloud run services update-traffic web --region us-central1 --to-revisions=<REVISION_ANTERIOR>=100
```
