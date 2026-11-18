import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { listActiveProducts } from "@/server/modules/catalog/catalog.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = siteConfig.nav.map((item) => item.href);
  const products = await listActiveProducts();

  return [
    ...staticPaths.map((path) => ({ url: `${siteConfig.url}${path}` })),
    ...products.map((p) => ({ url: `${siteConfig.url}/panaderia/${p.slug}` })),
  ];
}
