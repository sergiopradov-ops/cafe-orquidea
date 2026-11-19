import {
  cakeFlavorLabels,
  cakeSizeLabels,
  type LeadRequest,
  type LeadType,
} from "@/lib/schemas/lead";

const typeLabel: Record<LeadType, string> = {
  catering: "Catering",
  foodtruck: "Foodtruck",
  pastel: "Pastel",
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
  const contact: Array<[string, string]> = [
    ["Tipo", typeLabel[lead.type]],
    ["Nombre", lead.name],
    ["Correo", lead.email],
    ["Teléfono", lead.phone],
  ];
  if (lead.type === "pastel") {
    return [
      ...contact,
      ["Fecha del pastel", lead.eventDate],
      ["Tamaño", cakeSizeLabels[lead.size]],
      ["Sabor", cakeFlavorLabels[lead.flavor]],
      [
        "Intolerancias o alergias",
        lead.hasAllergies === "si" ? `Sí: ${lead.allergies ?? ""}` : "No",
      ],
      ["Decoración", lead.decoration ?? "—"],
    ];
  }
  return [
    ...contact,
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
