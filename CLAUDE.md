# Café Orquídea · Contexto para Claude

Sitio de Café Orquídea con tres unidades de negocio: **panadería** (e-commerce), **catering** (cotizaciones) y **foodtruck** (reservas). Monolito modular en Next.js desplegado en Cloud Run (GCP).

## Estado actual: Ola 1 (sitio vitrina)

- Sin base de datos ni pagos. El catálogo vive en `src/content/catalog.json`, validado con Zod.
- Catering y foodtruck: `LeadForm` → server action → `server/modules/leads` (Zod + reCAPTCHA Enterprise + Resend). WhatsApp como alternativa.
- reCAPTCHA se verifica con la identidad de Cloud Run (metadata server); en local se omite.
- Ola 2 (e-commerce con Stripe y Cloud SQL) **no se implementa todavía**. No agregues Prisma, Stripe ni auth sin que se pida.

## Comandos

```bash
pnpm dev          # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test         # Vitest
pnpm build
docker build -t cafe-orquidea . && docker run -p 8080:8080 cafe-orquidea
```

Antes de dar una tarea por terminada: `pnpm lint && pnpm typecheck && pnpm test`.

## Convenciones (obligatorias)

1. **Zod-first.** Todo contrato nace como schema en `src/lib/schemas/`. Tipos con `z.infer`, nunca duplicados a mano.
2. **Nada de lógica de negocio en componentes.** Va en `src/server/modules/<dominio>/`. Los componentes solo renderizan.
3. **Un dominio a la vez.** Módulos: `catalog`, `leads`, `orders`, `payments`, `catering`, `foodtruck`, `notifications`, `shared`. No importes entre dominios salvo `shared`.
4. **Dinero en centavos** (`*Cents`, enteros). Formatea solo en UI con `formatMXN`.
5. **Server Components por defecto.** `"use client"` solo cuando haya interactividad.
6. **Archivos de servicio** importan `"server-only"`. Lógica pura y testeable va en archivos separados (ej. `catalog.parser.ts`).
7. **UI:** Tailwind v4 + shadcn/ui (`pnpm dlx shadcn@latest add <componente>`). Mobile-first. WCAG AA: foco visible, contraste, `alt` en imágenes, labels en inputs.
8. **Idioma:** UI y documentación en español (México). Identificadores de código en inglés.
9. **Secretos** nunca en el repo. Local: `.env.local`. Producción: Secret Manager.
10. **Tests:** cada función de `server/modules` con lógica tiene test en `tests/unit/`.

## Estructura

```
src/app/(public)/        Páginas públicas (Home, panaderia, eventos, foodtruck, contacto)
src/app/api/             Route handlers (health; webhooks en Ola 2)
src/server/modules/      Lógica de negocio por dominio (catalog, leads, notifications, shared)
src/lib/schemas/         Schemas Zod (fuente de verdad)
src/components/          ui/ (shadcn), layout/, shop/, booking/
src/content/             Contenido estático de la Ola 1
infra/terraform/         IaC (envs/prod; modules/*)
docs/adr/                Decisiones de arquitectura
```

## Infraestructura

- Proyecto de prod (ID en la variable `GCP_PROJECT_ID` de GitHub), región `us-central1`. Cloud Run servicio `web`, SA `web-runtime`.
- Firebase Hosting delante de Cloud Run (SSL, CDN, dominio). Ver ADR 0003.
- Deploy: merge a `main` → GitHub Actions (WIF) → revisión sin tráfico → smoke test → 100%.
- Cambios de infra solo por Terraform. Nunca crear recursos a mano en la consola.

## Flujo de trabajo

1. Spec + schema Zod. 2. Plan (modo Plan). 3. Implementar un módulo. 4. Tests (subagente `test-writer`). 5. Revisión humana del diff. 6. PR → CI → deploy.
