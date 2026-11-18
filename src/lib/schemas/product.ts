import { z } from "zod";

/**
 * Fuente de verdad del producto. En la Ola 1 se valida contra
 * src/content/catalog.json; en la Ola 2 el mismo schema valida
 * lo que sale de Prisma, y la UI no cambia.
 */
export const productCategorySchema = z.enum([
  "cafe",
  "pan-dulce",
  "pan-salado",
  "pasteles",
  "bebidas",
]);

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug inválido"),
  name: z.string().min(1),
  description: z.string().default(""),
  priceCents: z.number().int().nonnegative(),
  category: productCategorySchema,
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  leadTimeHours: z.number().int().nonnegative().default(0),
});

export type Product = z.infer<typeof productSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;

export const categoryLabels: Record<ProductCategory, string> = {
  cafe: "Café",
  "pan-dulce": "Pan dulce",
  "pan-salado": "Salados",
  pasteles: "Pastelería",
  bebidas: "Bebidas frías",
};

/** Orden en que se muestran las categorías en el menú. */
export const categoryOrder: ProductCategory[] = [
  "cafe",
  "bebidas",
  "pan-dulce",
  "pasteles",
  "pan-salado",
];
