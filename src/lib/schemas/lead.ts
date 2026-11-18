import { z } from "zod";

/**
 * Solicitud de cotización (catering o foodtruck) de la Ola 1.
 * Se envía por correo con Resend (Día 5–6). En el Sprint 4–5 se
 * persiste en catering_requests / foodtruck_bookings.
 */
export const leadTypeSchema = z.enum(["catering", "foodtruck"]);

export const leadRequestSchema = z.object({
  type: leadTypeSchema,
  name: z.string().trim().min(2, "Escribe tu nombre"),
  email: z.email("Correo inválido"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{10,15}$/, "Teléfono inválido"),
  eventDate: z.iso.date("Fecha inválida"),
  guests: z.coerce.number().int().min(1).max(2000),
  location: z.string().trim().min(3, "Indica la ubicación"),
  notes: z.string().trim().max(2000).optional(),
  recaptchaToken: z.string().min(1).optional(),
});

export type LeadRequest = z.infer<typeof leadRequestSchema>;
