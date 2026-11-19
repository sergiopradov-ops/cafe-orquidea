import "server-only";

import { getServerEnv } from "@/server/modules/shared/env";

import { resolveEmailMode } from "./email.mode";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/**
 * Envío transaccional vía API REST de Resend (sin SDK, una dependencia menos).
 * Sin RESEND_API_KEY: en local el correo se escribe en el log; en
 * producción lanza error, para que quien llama no lo dé por enviado.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const env = getServerEnv();

  const mode = resolveEmailMode(env);
  if (mode === "misconfigured") {
    throw new Error("[email] RESEND_API_KEY no configurada en producción");
  }
  if (mode === "log") {
    console.warn("[email] RESEND_API_KEY no configurada; correo no enviado (local)", {
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
