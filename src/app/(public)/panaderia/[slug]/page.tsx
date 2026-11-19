import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/brand/icons";
import { Photo } from "@/components/media/photo";
import { categoryIcons } from "@/components/shop/product-card";
import { ProductTags } from "@/components/shop/product-tags";
import { ButtonLink } from "@/components/ui/button-link";
import { formatMXN } from "@/lib/format";
import { categoryLabels, categoryNotes } from "@/lib/schemas/product";
import { siteConfig } from "@/lib/site";
import {
  getProductBySlug,
  listActiveProducts,
} from "@/server/modules/catalog/catalog.service";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await listActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description || `${product.name} en Orquídea, Condesa CDMX.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <article className="container-page grid gap-10 pt-28 pb-24 sm:pt-36 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <Photo
          item={{ src: product.images[0] ?? null, alt: product.name }}
          icon={categoryIcons[product.category]}
          tone="durazno"
          priority
        />
      </div>

      <div className="lg:py-10">
        <Link href="/panaderia" className="inline-flex items-center gap-2 text-sm text-cafe hover:underline">
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Volver al menú
        </Link>
        <p className="eyebrow mt-8 text-cafe">{categoryLabels[product.category]}</p>
        <h1 className="mt-3 text-5xl leading-tight sm:text-6xl">{product.name}</h1>
        <p className="mt-6 text-3xl font-display">{formatMXN(product.priceCents)}</p>
        <ProductTags tags={product.tags} className="mt-5" />
        {product.description ? (
          <p className="mt-6 text-lg leading-relaxed text-tinta/80">{product.description}</p>
        ) : null}
        {categoryNotes[product.category] ? (
          <p className="mt-4 text-sm text-cafe">{categoryNotes[product.category]}</p>
        ) : null}
        {product.leadTimeHours > 0 ? (
          <p className="mt-4 text-sm text-cafe">
            Pídelo con {product.leadTimeHours} h de anticipación.
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/contacto">Visítanos</ButtonLink>
          <ButtonLink href={siteConfig.instagram} variant="outline" external>
            Ver en Instagram
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
