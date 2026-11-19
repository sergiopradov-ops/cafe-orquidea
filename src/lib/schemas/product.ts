import { z } from "zod";

/**
 * Fuente de verdad del producto. En la Ola 1 se valida contra
 * src/content/catalog.json; en la Ola 2 el mismo schema valida
 * lo que sale de Prisma, y la UI no cambia.
 */
export const productCategorySchema = z.enum([
  "bebidas-cafe",
  "bebidas-sin-cafe",
  "smoothies",
  "alimentos",
  "panaderia",
  "pasteles",
]);

/** Etiquetas dietéticas que se muestran junto al producto. */
export const productTagSchema = z.enum(["vegano", "keto", "sin-gluten"]);

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug inválido"),
  name: z.string().min(1),
  description: z.string().default(""),
  priceCents: z.number().int().nonnegative(),
  category: productCategorySchema,
  tags: z.array(productTagSchema).default([]),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  /** Aparece en "Los favoritos" de la Home. */
  isFeatured: z.boolean().default(false),
  leadTimeHours: z.number().int().nonnegative().default(0),
});

export type Product = z.infer<typeof productSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type ProductTag = z.infer<typeof productTagSchema>;

export const categoryLabels: Record<ProductCategory, string> = {
  "bebidas-cafe": "Bebidas de café",
  "bebidas-sin-cafe": "Bebidas sin café",
  smoothies: "Smoothies",
  alimentos: "Alimentos",
  panaderia: "Panadería",
  pasteles: "Pasteles",
};

/** Nota corta bajo el título de cada sección del menú. */
export const categoryNotes: Partial<Record<ProductCategory, string>> = {
  "bebidas-cafe": "Café mexicano de especialidad.",
  "bebidas-sin-cafe": "Todas las bebidas calientes las puedes pedir en frío: +$8.",
  smoothies: "Agrega un scoop de proteína a tu smoothie: +$70.",
  alimentos:
    "Cambia a pan sin gluten (almendra, coco, linaza, chía, nuez pecana y huevo): +$14.",
  panaderia: "Panadería artesanal sin gluten y sin azúcar.",
  pasteles: "Sin gluten y sin azúcar.",
};

export const tagLabels: Record<ProductTag, string> = {
  vegano: "Vegano",
  keto: "Keto",
  "sin-gluten": "Sin gluten",
};

/** Orden en que se muestran las categorías en el menú. */
export const categoryOrder: ProductCategory[] = [
  "bebidas-cafe",
  "bebidas-sin-cafe",
  "smoothies",
  "alimentos",
  "panaderia",
  "pasteles",
];
