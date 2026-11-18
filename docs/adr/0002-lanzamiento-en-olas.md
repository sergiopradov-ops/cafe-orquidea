# ADR 0002 · Lanzamiento en dos olas

- **Estado:** Aceptada
- **Fecha:** 2026-11-17

## Contexto

El cliente quiere presencia en línea lo antes posible y no necesita vender pan en línea desde el día uno. La verificación de Stripe México y el contenido del cliente son la ruta crítica, no el código.

## Decisión

- **Ola 1 (≈7 días):** sitio vitrina. Catálogo estático (JSON validado con `productSchema`), páginas de catering y foodtruck con CTA a WhatsApp y después formularios (Resend + reCAPTCHA). Anticipos con Stripe Payment Links creados manualmente. Sin base de datos.
- **Ola 2 (+2–3 semanas):** e-commerce con Cloud SQL + Prisma, Stripe Checkout (tarjeta + OXXO) y `daily_capacity`.

## Consecuencias

- Go-live temprano con costo de infraestructura casi nulo (Cloud Run con min-instances=0).
- El catálogo ya tiene la forma de `productSchema`: en la Ola 2 solo cambia la fuente de datos en `catalog.service.ts`.
- Solo existe `orquidea-prod` al inicio. `orquidea-dev` se crea en la Ola 2, antes de manejar pagos.
