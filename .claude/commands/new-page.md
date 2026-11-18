---
description: Crea una página pública nueva siguiendo las convenciones del proyecto
argument-hint: <ruta> <propósito>
---

Crea una página pública en `src/app/(public)/$1/page.tsx` cuyo propósito es: $ARGUMENTS

Requisitos:

- Server Component con `export const metadata` (title y description en español).
- Mobile-first con Tailwind, usando los tokens de `globals.css` (orquidea-*, crema, cafe, trigo).
- Si necesita datos, créalos en `src/server/modules/<dominio>/` con schema Zod en `src/lib/schemas/`.
- Agrega la ruta a `siteConfig.nav` si debe aparecer en el menú (el sitemap la toma de ahí).
- Termina ejecutando `pnpm lint && pnpm typecheck`.
