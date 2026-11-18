import Link from "next/link";

import { formatMXN } from "@/lib/format";
import { categoryLabels, type Product } from "@/lib/schemas/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col rounded-2xl border border-orquidea-100 bg-white p-5 shadow-sm">
      <p className="text-xs tracking-wide text-orquidea-700 uppercase">
        {categoryLabels[product.category]}
      </p>
      <h3 className="mt-1 text-xl">
        <Link href={`/panaderia/${product.slug}`} className="hover:underline">
          {product.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-cafe/80">
        {product.description}
      </p>
      <p className="mt-4 font-semibold">{formatMXN(product.priceCents)}</p>
      {product.leadTimeHours > 0 ? (
        <p className="text-xs text-cafe/70">
          Pedido con {product.leadTimeHours} h de anticipación
        </p>
      ) : null}
    </article>
  );
}
