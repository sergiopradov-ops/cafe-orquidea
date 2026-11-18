/**
 * Fotos del sitio. Mientras `src` sea null se muestra una ilustración de línea.
 * Para usar una foto real: cópiala a /public/images/ y pon aquí la ruta,
 * por ejemplo  src: "/images/hero.jpg".
 * Usar solo fotos propias del cliente (con derechos de uso).
 */
export type MediaItem = { src: string | null; alt: string };

export const media = {
  hero: { src: null, alt: "Barra de café de Orquídea en la Condesa" },
  cafe: { src: null, alt: "Mesa con café y repostería en Orquídea" },
  catering: { src: null, alt: "Mesa de catering de Orquídea para un evento" },
  foodtruck: { src: null, alt: "Foodtruck de café Orquídea" },
  comunidad: { src: null, alt: "Club de corredores de Orquídea" },
} satisfies Record<string, MediaItem>;
