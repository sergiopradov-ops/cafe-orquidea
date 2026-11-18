# ADR 0003 · Firebase Hosting delante de Cloud Run (en lugar de Global LB)

- **Estado:** Aceptada (revisar en Sprint 7)
- **Fecha:** 2026-11-17

## Contexto

El roadmap original propone Global External Application LB + Cloud Armor + Cloud CDN. Configurarlo toma tiempo y cuesta alrededor de USD 18/mes de base, aun sin tráfico.

## Decisión

Para la Ola 1, Firebase Hosting con rewrite `**` → Cloud Run `web` (us-central1). Aporta SSL administrado, CDN global y dominio propio con configuración mínima.

## Consecuencias

- Costo base casi nulo y dominio en minutos.
- Sin WAF ni rate limiting a nivel de borde. Se mitiga con reCAPTCHA Enterprise en formularios.
- Límite de 60 s por request en rewrites de Hosting (suficiente para SSR).
- **Revisión en el Sprint 7 (hardening):** migrar a Global LB + Cloud Armor antes de exponer checkout con volumen relevante, o si aparece spam/abuso.
