import { describe, expect, it } from "vitest";

import rawCatalog from "@/content/catalog.json";
import { formatMXN } from "@/lib/format";
import { parseCatalog } from "@/server/modules/catalog/catalog.parser";

const base = {
  id: "p1",
  slug: "pan",
  name: "Pan",
  priceCents: 1000,
  category: "pan-dulce",
};

describe("parseCatalog", () => {
  it("valida el catálogo real del repo", () => {
    expect(() => parseCatalog(rawCatalog)).not.toThrow();
  });

  it("rechaza slugs duplicados", () => {
    expect(() => parseCatalog([base, { ...base, id: "p2" }])).toThrow(
      /Slug duplicado/,
    );
  });

  it("rechaza precios no enteros (siempre centavos)", () => {
    expect(() => parseCatalog([{ ...base, priceCents: 10.5 }])).toThrow();
  });

  it("rechaza slugs con mayúsculas o espacios", () => {
    expect(() => parseCatalog([{ ...base, slug: "Pan Dulce" }])).toThrow();
  });
});

describe("formatMXN", () => {
  it("formatea centavos a pesos", () => {
    expect(formatMXN(3500)).toMatch(/35\.00/);
  });
});
