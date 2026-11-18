import { z } from "zod";

import { productSchema, type Product } from "@/lib/schemas/product";

/**
 * Valida el catálogo completo y garantiza slugs/ids únicos.
 * Lógica pura (sin "server-only") para poder probarla en Vitest.
 */
export function parseCatalog(input: unknown): Product[] {
  const products = z.array(productSchema).parse(input);

  const seenSlugs = new Set<string>();
  const seenIds = new Set<string>();
  for (const p of products) {
    if (seenSlugs.has(p.slug)) throw new Error(`Slug duplicado: ${p.slug}`);
    if (seenIds.has(p.id)) throw new Error(`Id duplicado: ${p.id}`);
    seenSlugs.add(p.slug);
    seenIds.add(p.id);
  }
  return products;
}
