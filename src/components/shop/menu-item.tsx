import Link from "next/link";

import { ProductTags } from "@/components/shop/product-tags";
import { formatMXN } from "@/lib/format";
import type { Product } from "@/lib/schemas/product";

/** Renglón de carta: nombre, precio, descripción y etiquetas. */
export function MenuItem({ product }: { product: Product }) {
  return (
    <li className="border-b border-cafe/10 py-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xl leading-snug sm:text-2xl">
          <Link href={`/panaderia/${product.slug}`} className="hover:underline underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="shrink-0 font-display text-xl text-cafe">
          {formatMXN(product.priceCents, { decimals: false })}
        </p>
      </div>
      {product.description ? (
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-tinta/70">{product.description}</p>
      ) : null}
      <ProductTags tags={product.tags} className="mt-2.5" />
    </li>
  );
}
