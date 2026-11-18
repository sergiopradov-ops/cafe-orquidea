import "server-only";

import { leadRequestSchema } from "@/lib/schemas/lead";
import { sendEmail } from "@/server/modules/notifications/email.service";
import { getServerEnv } from "@/server/modules/shared/env";
import { verifyRecaptcha } from "@/server/modules/shared/recaptcha";

import { buildCustomerAckEmail, buildInternalLeadEmail } from "./lead-email";

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string[]>; message: string };

/**
 * Ola 1: valida, verifica reCAPTCHA y envía por correo.
 * Sprint 4–5: además persistirá en catering_requests / foodtruck_bookings.
 */
export async function submitLead(input: unknown): Promise<SubmitLeadResult> {
  const parsed = leadRequestSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { ok: false, fieldErrors, message: "Revisa los campos marcados." };
  }
  const lead = parsed.data;

  const captcha = await verifyRecaptcha(lead.recaptchaToken, `lead_${lead.type}`);
  if (!captcha.ok) {
    console.warn("[leads] reCAPTCHA rechazado", captcha.reason);
    return {
      ok: false,
      message: "No pudimos validar el envío. Intenta de nuevo o escríbenos por WhatsApp.",
    };
  }

  const env = getServerEnv();

  // 1) Correo al negocio: es lo crítico. Si falla, el cliente debe saberlo.
  try {
    if (env.leadsInboxEmail) {
      const internal = buildInternalLeadEmail(lead);
      await sendEmail({ to: env.leadsInboxEmail, replyTo: lead.email, ...internal });
    } else {
      console.warn("[leads] LEADS_INBOX_EMAIL no configurado", { type: lead.type });
    }
  } catch (err) {
    console.error("[leads] error enviando correo interno", err);
    return {
      ok: false,
      message: "Hubo un problema al enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.",
    };
  }

  // 2) Acuse al cliente: best-effort. Mientras el dominio no esté verificado
  //    en Resend, el remitente de prueba solo entrega al dueño de la cuenta.
  try {
    await sendEmail({ to: lead.email, ...buildCustomerAckEmail(lead) });
  } catch (err) {
    console.warn("[leads] acuse al cliente no enviado", err);
  }

  return { ok: true };
}
