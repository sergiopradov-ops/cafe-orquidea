# Bootstrap de Café Orquídea en GCP

## Ejecutar el bootstrap

Crea la infraestructura en `cafeorquide-prod` y publica el sitio.

```sh
git pull -q origin main && NONINTERACTIVE=1 GITHUB_REPO=sergiopradov-ops/cafe-orquidea PROJECT_ID=cafeorquide-prod DOMAIN=orquidea.cafe LEADS_INBOX_EMAIL=patychavezreza@gmail.com CONTACT_EMAIL=patychavezreza@gmail.com ./scripts/bootstrap-gcp.sh 2>&1 | tee ~/bootstrap.log
```

## Ver resultados

```sh
export PATH="$HOME/bin:$PATH"; cd infra/terraform/envs/prod && terraform output; cd -
```

## Firebase login (solo si el paso 6 falló por autenticación)

```sh
npx -y firebase-tools@latest login --no-localhost
```
