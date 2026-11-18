import "server-only";

import { getServerEnv } from "./env";

export type RecaptchaResult =
  | { ok: true; score: number | null; skipped: boolean }
  | { ok: false; reason: string };

/**
 * Verifica un token de reCAPTCHA Enterprise creando un assessment.
 * Autenticación con la identidad del servicio de Cloud Run (metadata server),
 * así que no hace falta API key ni secreto.
 * En local (sin site key o fuera de producción) se omite la verificación.
 */
export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction: string,
): Promise<RecaptchaResult> {
  const env = getServerEnv();

  if (!env.isProduction || !env.recaptchaSiteKey || !env.gcpProjectId) {
    return { ok: true, score: null, skipped: true };
  }
  if (!token) return { ok: false, reason: "missing-token" };

  const accessToken = await getMetadataAccessToken();
  const res = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${env.gcpProjectId}/assessments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: { token, siteKey: env.recaptchaSiteKey, expectedAction },
      }),
      signal: AbortSignal.timeout(5_000),
    },
  );

  if (!res.ok) {
    console.error("[recaptcha] assessment falló", res.status);
    return { ok: false, reason: "assessment-error" };
  }

  const data = (await res.json()) as {
    tokenProperties?: { valid?: boolean; action?: string; invalidReason?: string };
    riskAnalysis?: { score?: number };
  };

  if (!data.tokenProperties?.valid) {
    return { ok: false, reason: data.tokenProperties?.invalidReason ?? "invalid" };
  }
  if (data.tokenProperties.action !== expectedAction) {
    return { ok: false, reason: "action-mismatch" };
  }
  const score = data.riskAnalysis?.score ?? 0;
  if (score < env.recaptchaMinScore) return { ok: false, reason: "low-score" };

  return { ok: true, score, skipped: false };
}

async function getMetadataAccessToken(): Promise<string> {
  const res = await fetch(
    "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
    { headers: { "Metadata-Flavor": "Google" }, signal: AbortSignal.timeout(2_000) },
  );
  if (!res.ok) throw new Error(`metadata server respondió ${res.status}`);
  const { access_token } = (await res.json()) as { access_token: string };
  return access_token;
}
