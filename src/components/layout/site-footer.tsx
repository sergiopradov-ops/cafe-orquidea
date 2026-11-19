import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-salvia-oscuro text-crema">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-14" />
          <p className="mt-4 max-w-xs text-sm text-crema/70">{siteConfig.tagline}</p>
        </div>

        <div>
          <h2 className="eyebrow text-crema/60">Visítanos</h2>
          <address className="mt-4 text-sm leading-7 not-italic">
            <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {siteConfig.address}
            </a>
            {siteConfig.hours.map((h) => (
              <span key={h.days} className="block">
                {h.days}, {h.time}
              </span>
            ))}
          </address>
        </div>

        <div>
          <h2 className="eyebrow text-crema/60">Orquídea</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-crema/60">Síguenos</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram {siteConfig.instagramHandle}
              </a>
            </li>
            {siteConfig.email ? (
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                  {siteConfig.email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-crema/10">
        <p className="container-page py-6 text-xs text-crema/50">
          © {new Date().getFullYear()} {siteConfig.legalName}. Café de especialidad · Sin azúcar · Keto · Sin gluten.
        </p>
      </div>
    </footer>
  );
}
