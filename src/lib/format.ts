const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/** Todos los montos se guardan en centavos (enteros). */
export function formatMXN(cents: number): string {
  return mxn.format(cents / 100);
}
