/**
 * Fotos del sitio. Mientras `src` sea null se muestra una ilustración de línea.
 * Para usar una foto real: cópiala a /public/images/ y pon aquí la ruta,
 * por ejemplo  src: "/images/hero.jpg".
 * Usar solo fotos propias del cliente (con derechos de uso).
 */
export type MediaItem = {
  src: string | null;
  alt: string;
  /** "contain" para recortes sobre fondo blanco (la foto no se corta). */
  fit?: "cover" | "contain";
};

export const media = {
  hero: { src: null, alt: "Barra de café de Orquídea en la Condesa" },
  cafe: { src: null, alt: "Mesa con café y repostería en Orquídea" },
  catering: {
    src: "/images/catering-barra.jpg",
    alt: "Barra de café de Orquídea con cafetera, repostería y orquídeas para un evento",
  },
  foodtruck: {
    src: "/images/foodtruck.jpg",
    alt: "Foodtruck negro de Orquídea con luces, eucalipto, flores y mesa de jardín",
    fit: "contain",
  },
  comunidad: { src: null, alt: "Club de corredores de Orquídea" },
} satisfies Record<string, MediaItem>;
