import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-orquidea-100 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        {siteConfig.email ? (
          <a href={`mailto:${siteConfig.email}`} className="hover:underline">
            {siteConfig.email}
          </a>
        ) : null}
      </div>
    </footer>
  );
}
