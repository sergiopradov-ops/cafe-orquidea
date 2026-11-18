import "server-only";

import { getServerEnv } from "@/server/modules/shared/env";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/**
 * Envío transaccional vía API REST de Resend (sin SDK, una dependencia menos).
 * Si RESEND_API_KEY no está configurada, el correo se escribe en el log
 * (útil en local y mientras el cliente verifica su dominio en Resend).
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const env = getServerEnv();

  if (!env.resendApiKey) {
    console.warn("[email] RESEND_API_KEY no configurada; correo no enviado", {
      to: input.to,
      subject: input.subject,
    });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend respondió ${res.status}: ${body.slice(0, 300)}`);
  }
}
