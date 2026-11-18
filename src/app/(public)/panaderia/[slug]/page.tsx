import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatMXN } from "@/lib/format";
import { categoryLabels } from "@/lib/schemas/product";
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
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/panaderia" className="text-sm text-orquidea-700 hover:underline">
        ← Volver al menú
      </Link>
      <p className="mt-6 text-xs tracking-wide text-orquidea-700 uppercase">
        {categoryLabels[product.category]}
      </p>
      <h1 className="mt-1 text-4xl">{product.name}</h1>
      <p className="mt-4 text-lg text-cafe/80">{product.description}</p>
      <p className="mt-6 text-2xl font-semibold">
        {formatMXN(product.priceCents)}
      </p>
    </article>
  );
}
