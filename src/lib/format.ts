const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const mxnWhole = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/**
 * Todos los montos se guardan en centavos (enteros).
 * `decimals: false` omite los centavos (ej. "$66"), útil en la carta.
 */
export function formatMXN(cents: number, { decimals = true }: { decimals?: boolean } = {}): string {
  return (decimals || cents % 100 !== 0 ? mxn : mxnWhole).format(cents / 100);
}
