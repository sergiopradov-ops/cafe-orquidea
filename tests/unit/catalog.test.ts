import { describe, expect, it } from "vitest";

import rawCatalog from "@/content/catalog.json";
import { formatMXN } from "@/lib/format";
import { categoryOrder } from "@/lib/schemas/product";
import { parseCatalog } from "@/server/modules/catalog/catalog.parser";

const base = {
  id: "p1",
  slug: "pan",
  name: "Pan",
  priceCents: 1000,
  category: "panaderia",
};

describe("parseCatalog", () => {
  it("valida el catálogo real del repo", () => {
    expect(() => parseCatalog(rawCatalog)).not.toThrow();
  });

  it("tiene productos en cada sección del menú y 4 favoritos", () => {
    const products = parseCatalog(rawCatalog);
    for (const c of categoryOrder) {
      expect(products.some((p) => p.category === c)).toBe(true);
    }
    expect(products.filter((p) => p.isFeatured)).toHaveLength(4);
  });

  it("rechaza slugs duplicados", () => {
    expect(() => parseCatalog([base, { ...base, id: "p2" }])).toThrow(
      /Slug duplicado/,
    );
  });

  it("rechaza precios no enteros (siempre centavos)", () => {
    expect(() => parseCatalog([{ ...base, priceCents: 10.5 }])).toThrow();
  });

  it("rechaza etiquetas dietéticas desconocidas", () => {
    expect(() => parseCatalog([{ ...base, tags: ["sin-azucar"] }])).toThrow();
  });

  it("rechaza slugs con mayúsculas o espacios", () => {
    expect(() => parseCatalog([{ ...base, slug: "Pan Dulce" }])).toThrow();
  });
});

describe("formatMXN", () => {
  it("formatea centavos a pesos", () => {
    expect(formatMXN(3500)).toMatch(/35\.00/);
  });

  it("omite centavos en modo carta solo si son cero", () => {
    expect(formatMXN(6600, { decimals: false })).not.toMatch(/\./);
    expect(formatMXN(6650, { decimals: false })).toMatch(/66\.50/);
  });
});
