/** Fechas de calendario (YYYY-MM-DD) en la zona horaria del negocio. */
export const BUSINESS_TIME_ZONE = "America/Mexico_City";

/** Fecha de hoy en CDMX desplazada `days` días, como YYYY-MM-DD. */
export function businessDatePlusDays(now: Date, days: number): string {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
