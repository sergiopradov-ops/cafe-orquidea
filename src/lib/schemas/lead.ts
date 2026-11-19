import { z } from "zod";

/**
 * Solicitudes de la Ola 1: catering, foodtruck y pastel por pedido.
 * Se envían por correo con Resend. En el Sprint 4–5 las de eventos se
 * persisten en catering_requests / foodtruck_bookings.
 */
export const leadTypeSchema = z.enum(["catering", "foodtruck", "pastel"]);

const contactFields = {
  name: z.string().trim().min(2, "Escribe tu nombre"),
  email: z.email("Correo inválido"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{10,15}$/, "Teléfono inválido"),
  recaptchaToken: z.string().min(1).optional(),
};

/** Catering y foodtruck. */
export const eventLeadSchema = z.object({
  type: z.enum(["catering", "foodtruck"]),
  ...contactFields,
  eventDate: z.iso.date("Fecha inválida"),
  guests: z.coerce.number().int().min(1).max(2000),
  location: z.string().trim().min(3, "Indica la ubicación"),
  notes: z.string().trim().max(2000).optional(),
});

/** Tamaño del pastel, en número de personas. */
export const cakeSizeSchema = z.enum(["5", "8", "14", "20"], "Elige un tamaño");
export const cakeFlavorSchema = z.enum(
  ["vainilla", "cacao", "zanahoria", "platano"],
  "Elige un sabor",
);

export const cakeSizeLabels: Record<z.infer<typeof cakeSizeSchema>, string> = {
  "5": "5 personas",
  "8": "8 personas",
  "14": "14 personas",
  "20": "20 personas",
};

export const cakeFlavorLabels: Record<z.infer<typeof cakeFlavorSchema>, string> = {
  vainilla: "Vainilla",
  cacao: "Cacao",
  zanahoria: "Zanahoria",
  platano: "Plátano",
};

/** Pastel por pedido. */
export const cakeLeadSchema = z.object({
  type: z.literal("pastel"),
  ...contactFields,
  eventDate: z.iso.date("Fecha inválida"),
  size: cakeSizeSchema,
  flavor: cakeFlavorSchema,
  hasAllergies: z.enum(["si", "no"], "Indica si hay intolerancias o alergias"),
  allergies: z.string().trim().max(500).optional(),
  decoration: z.string().trim().max(1000).optional(),
});

export const leadRequestSchema = z
  .discriminatedUnion("type", [eventLeadSchema, cakeLeadSchema])
  .superRefine((lead, ctx) => {
    if (lead.type === "pastel" && lead.hasAllergies === "si" && !lead.allergies) {
      ctx.addIssue({
        code: "custom",
        path: ["allergies"],
        message: "Cuéntanos qué intolerancias o alergias hay",
      });
    }
  });

export type LeadType = z.infer<typeof leadTypeSchema>;
export type EventLead = z.infer<typeof eventLeadSchema>;
export type CakeLead = z.infer<typeof cakeLeadSchema>;
export type LeadRequest = z.infer<typeof leadRequestSchema>;
