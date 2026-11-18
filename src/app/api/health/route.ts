// Usado por el smoke test del pipeline y por el uptime check de Cloud Monitoring.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    revision: process.env.K_REVISION ?? "local",
  });
}
