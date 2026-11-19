import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { MenuItem } from "@/components/shop/menu-item";
import { categoryLabels, categoryNotes, categoryOrder } from "@/lib/schemas/product";
import { siteConfig } from "@/lib/site";
import { listActiveProducts } from "@/server/modules/catalog/catalog.service";

export const metadata: Metadata = {
  title: "Menú",
  description:
    "Bebidas de café, bebidas sin café, smoothies, alimentos, panadería y pasteles sin gluten y sin azúcar.",
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
          Panadería sin gluten y sin azúcar, café mexicano de especialidad y
          desayunos para quedarte en {siteConfig.address} o para llevar.
        </p>
      </PageHero>

      <nav
        aria-label="Secciones del menú"
        className="sticky top-16 z-30 border-b border-cafe/10 bg-crema/95 backdrop-blur sm:top-20"
      >
        <ul className="container-page flex gap-2 overflow-x-auto py-3 text-sm whitespace-nowrap">
          {groups.map((g) => (
            <li key={g.category}>
              <a
                href={`#${g.category}`}
                className="inline-block rounded-full border border-cafe/20 px-4 py-1.5 transition-colors hover:bg-durazno-claro"
              >
                {categoryLabels[g.category]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page grid gap-16 pt-12 pb-24 lg:grid-cols-2 lg:gap-x-20">
        {groups.map((g) => (
          <section
            key={g.category}
            id={g.category}
            aria-labelledby={`cat-${g.category}`}
            className="scroll-mt-36 sm:scroll-mt-40"
          >
            <h2 id={`cat-${g.category}`} className="text-4xl">
              {categoryLabels[g.category]}
            </h2>
            {categoryNotes[g.category] ? (
              <p className="mt-2 text-sm text-cafe">{categoryNotes[g.category]}</p>
            ) : null}
            {g.category === "pasteles" ? (
              <Link
                href="/pasteles"
                className="mt-4 inline-block rounded-full bg-salvia px-5 py-2.5 text-sm font-medium text-crema transition-colors hover:bg-salvia-oscuro"
              >
                Cotiza un pastel entero
              </Link>
            ) : null}
            <ul className="mt-4">
              {g.items.map((p) => (
                <MenuItem key={p.id} product={p} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="container-page pb-16 text-xs text-tinta/60">
        Precios en pesos mexicanos.
      </p>
    </>
  );
}
