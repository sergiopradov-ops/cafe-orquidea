import "server-only";

const PLACEHOLDER = "pending";

function secret(value: string | undefined): string | undefined {
  // Los secretos se crean con un valor "pending" hasta que el cliente
  // entregue la llave real (ver scripts/bootstrap-gcp.sh).
  if (!value || value === PLACEHOLDER) return undefined;
  return value;
}

export function getServerEnv() {
  return {
    isProduction: process.env.NODE_ENV === "production",
    gcpProjectId: process.env.GCP_PROJECT_ID,
    resendApiKey: secret(process.env.RESEND_API_KEY),
    emailFrom: process.env.EMAIL_FROM ?? "Café Orquídea <onboarding@resend.dev>",
    leadsInboxEmail: process.env.LEADS_INBOX_EMAIL,
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    recaptchaMinScore: Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5"),
  };
}
