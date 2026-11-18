import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ProductCard } from "@/components/shop/product-card";
import { categoryLabels, categoryOrder } from "@/lib/schemas/product";
import { siteConfig } from "@/lib/site";
import { listActiveProducts } from "@/server/modules/catalog/catalog.service";

export const metadata: Metadata = {
  title: "Menú",
  description: "Café de especialidad y repostería sin azúcar, keto y sin gluten.",
};

export default async function MenuPage() {
  const products = await listActiveProducts();
  const groups = categoryOrder
    .map((category) => ({
      category,
      items: products.filter((p) => p.category === category),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero eyebrow="Menú" title="Café de especialidad y antojos sin culpa.">
        <p>
          Repostería sin azúcar, keto y sin gluten. Para quedarte en{" "}
          {siteConfig.address} o para llevar. Los pedidos en línea llegan pronto.
        </p>
      </PageHero>

      <div className="container-page py-6">
        <p className="rounded-xl bg-durazno-claro px-4 py-3 text-sm">
          Menú de muestra: productos y precios por confirmar.
        </p>
      </div>

      <div className="container-page space-y-20 pt-10 pb-24">
        {groups.map((g) => (
          <section key={g.category} aria-labelledby={`cat-${g.category}`}>
            <h2 id={`cat-${g.category}`} className="text-4xl">
              {categoryLabels[g.category]}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {g.items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
