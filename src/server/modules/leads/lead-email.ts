import type { LeadRequest } from "@/lib/schemas/lead";

const typeLabel: Record<LeadRequest["type"], string> = {
  catering: "Catering",
  foodtruck: "Foodtruck",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function rows(lead: LeadRequest): Array<[string, string]> {
  return [
    ["Tipo", typeLabel[lead.type]],
    ["Nombre", lead.name],
    ["Correo", lead.email],
    ["Teléfono", lead.phone],
    ["Fecha del evento", lead.eventDate],
    ["Invitados", String(lead.guests)],
    ["Ubicación", lead.location],
    ["Notas", lead.notes ?? "—"],
  ];
}

/** Correo interno para el equipo (lógica pura, testeable). */
export function buildInternalLeadEmail(lead: LeadRequest) {
  const subject = `Nueva solicitud de ${typeLabel[lead.type]}: ${lead.name} · ${lead.eventDate}`;
  const text = rows(lead)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const html = `<h2>${escapeHtml(subject)}</h2><table cellpadding="6">${rows(lead)
    .map(
      ([k, v]) =>
        `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;
  return { subject, text, html };
}

/** Acuse de recibo para el cliente. */
export function buildCustomerAckEmail(lead: LeadRequest) {
  const subject = `Recibimos tu solicitud de ${typeLabel[lead.type].toLowerCase()} · Café Orquídea`;
  const greeting = `Hola ${lead.name},`;
  const body =
    "Gracias por escribirnos. Recibimos tu solicitud y te contactaremos en menos de 24 horas hábiles con una cotización.";
  return {
    subject,
    text: `${greeting}\n\n${body}\n\nCafé Orquídea`,
    html: `<p>${escapeHtml(greeting)}</p><p>${escapeHtml(body)}</p><p>Café Orquídea</p>`,
  };
}
