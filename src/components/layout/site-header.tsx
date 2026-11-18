"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Header fijo. En la Home empieza transparente sobre la portada y se vuelve
 * sólido al hacer scroll; en las demás páginas siempre es sólido.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        overlay
          ? "bg-transparent text-crema"
          : "bg-crema/95 text-tinta shadow-[0_1px_0_rgba(43,42,36,0.08)] backdrop-blur",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" aria-label="Orquídea, inicio" onClick={() => setOpen(false)}>
          <Logo className="text-4xl sm:text-5xl" />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[15px]">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  className="underline-offset-8 hover:underline aria-[current=page]:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/eventos"
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                  overlay
                    ? "bg-crema text-tinta hover:bg-white"
                    : "bg-salvia text-crema hover:bg-salvia-oscuro",
                )}
              >
                Cotiza tu evento
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open ? (
        <nav id="menu-movil" aria-label="Menú móvil" className="border-t border-tinta/10 md:hidden">
          <ul className="container-page flex flex-col py-4">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-2xl"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/eventos"
                onClick={() => setOpen(false)}
                className="inline-block rounded-full bg-salvia px-6 py-3 text-sm font-medium text-crema"
              >
                Cotiza tu evento
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
