/**
 * Decide qué hace sendEmail según la configuración. Lógica pura (sin
 * "server-only") para poder probarla en Vitest.
 *
 * - "send": hay llave de Resend, se envía.
 * - "log": fuera de producción sin llave, el correo solo se escribe en el log.
 * - "misconfigured": en producción sin llave. Es un error: si se tratara
 *   como envío exitoso, el cliente vería "¡Gracias!" y la solicitud se perdería.
 */
export type EmailMode = "send" | "log" | "misconfigured";

export function resolveEmailMode(env: {
  isProduction: boolean;
  resendApiKey: string | undefined;
}): EmailMode {
  if (env.resendApiKey) return "send";
  return env.isProduction ? "misconfigured" : "log";
}
