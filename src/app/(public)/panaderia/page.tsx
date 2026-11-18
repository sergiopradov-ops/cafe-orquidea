import type { Metadata } from "next";

import { ProductCard } from "@/components/shop/product-card";
import { listActiveProducts } from "@/server/modules/catalog/catalog.service";

export const metadata: Metadata = {
  title: "Panadería",
  description: "Nuestro menú de pan artesanal, pasteles y bebidas.",
};

export default async function PanaderiaPage() {
  const products = await listActiveProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl">Panadería</h1>
      <p className="mt-2 text-cafe/80">
        Menú del día. Los pedidos en línea llegan pronto.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
