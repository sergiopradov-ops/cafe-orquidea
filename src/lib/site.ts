const address = "Amsterdam 147, CDMX";

export const siteConfig = {
  name: "Orquídea",
  legalName: "Café Orquídea",
  tagline: "Magia y paz en cada sorbo de café.",
  description:
    "Café de especialidad en la Condesa. Repostería sin azúcar, keto y sin gluten, catering para eventos y foodtruck.",
  // `||` y no `??`: en Docker los build args vacíos llegan como "" (no undefined).
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@orquidea.cafe",
  phone: { display: "55 18 147 147", href: "tel:+525518147147" },
  instagram: "https://www.instagram.com/orquidea.cafe/",
  instagramHandle: "@orquidea.cafe",
  address,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Orquídea café, ${address}`)}`,
  hours: [{ days: "Lunes a viernes", time: "7:00 a 21:00" }],
  highlights: ["Café de especialidad", "Sin azúcar", "Keto", "Sin gluten"],
  nav: [
    { href: "/panaderia", label: "Menú" },
    { href: "/eventos", label: "Catering" },
    { href: "/foodtruck", label: "Foodtruck" },
    { href: "/contacto", label: "Visítanos" },
  ],
} as const;

/** Devuelve null si no hay número configurado (la UI oculta el CTA). */
export function whatsappLink(message: string): string | null {
  if (!siteConfig.whatsapp) return null;
  const text = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}
