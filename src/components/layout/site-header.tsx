import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-orquidea-100 bg-crema/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-orquidea-700"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Principal" className="overflow-x-auto">
          <ul className="flex gap-4 text-sm whitespace-nowrap">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-orquidea-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
