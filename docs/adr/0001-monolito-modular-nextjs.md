# ADR 0001 · Monolito modular en Next.js

- **Estado:** Aceptada
- **Fecha:** 2026-11-17

## Contexto

Tres unidades de negocio (panadería, catering, foodtruck) con volumen bajo a medio y un equipo pequeño que desarrolla con apoyo de Claude.

## Decisión

Una sola app Next.js (App Router, TypeScript) que contiene UI, route handlers y lógica de negocio en `src/server/modules/<dominio>`. Se despliega como un solo servicio en Cloud Run.

## Consecuencias

- Un solo deploy, un solo pipeline, una sola auth.
- Los límites entre dominios se mantienen por convención (ver `CLAUDE.md`) y revisión de código.
- Si un dominio crece (por ejemplo, reservas del foodtruck), se extrae como servicio aparte sin rediseñar los demás.
