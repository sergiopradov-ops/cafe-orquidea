export const siteConfig = {
  name: "Café Orquídea",
  description:
    "Pan artesanal, catering para eventos y foodtruck en la Ciudad de México.",
  // `||` y no `??`: en Docker los build args vacíos llegan como "" (no undefined).
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/panaderia", label: "Panadería" },
    { href: "/eventos", label: "Catering" },
    { href: "/foodtruck", label: "Foodtruck" },
    { href: "/contacto", label: "Contacto" },
  ],
} as const;

/** Devuelve null si no hay número configurado (la UI oculta el CTA). */
export function whatsappLink(message: string): string | null {
  if (!siteConfig.whatsapp) return null;
  const text = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}
