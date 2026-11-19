import "server-only";

import rawCatalog from "@/content/catalog.json";
import type { Product } from "@/lib/schemas/product";

import { parseCatalog } from "./catalog.parser";

/**
 * Ola 1: catálogo estático desde JSON, validado con Zod al cargar.
 * Ola 2: estas funciones pasan a leer de Prisma con la misma firma.
 */
const catalog: Product[] = parseCatalog(rawCatalog);

export async function listActiveProducts(): Promise<Product[]> {
  return catalog.filter((p) => p.isActive);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return catalog.find((p) => p.slug === slug && p.isActive) ?? null;
}

/** Productos marcados como favoritos (Home). */
export async function listFeaturedProducts(): Promise<Product[]> {
  return catalog.filter((p) => p.isActive && p.isFeatured);
}
