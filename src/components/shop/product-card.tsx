import Link from "next/link";

import type { IconName } from "@/components/brand/icons";
import { Photo } from "@/components/media/photo";
import { formatMXN } from "@/lib/format";
import { categoryLabels, type Product, type ProductCategory } from "@/lib/schemas/product";

export const categoryIcons: Record<ProductCategory, IconName> = {
  cafe: "cup",
  "pan-dulce": "bread",
  "pan-salado": "bread",
  pasteles: "cake",
  bebidas: "iced",
};

const tones = ["durazno", "arena", "crema"] as const;

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const image = product.images[0] ?? null;

  return (
    <article className="group">
      <Link href={`/panaderia/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Photo
            item={{ src: image, alt: product.name }}
            icon={categoryIcons[product.category]}
            tone={tones[index % tones.length]}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <p className="eyebrow mt-4 text-cafe">{categoryLabels[product.category]}</p>
        <h3 className="mt-1 text-2xl">{product.name}</h3>
      </Link>
      <p className="mt-1 text-sm text-tinta/70">{formatMXN(product.priceCents)}</p>
    </article>
  );
}
