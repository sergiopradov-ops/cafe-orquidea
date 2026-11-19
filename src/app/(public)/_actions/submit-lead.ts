"use server";

import { submitLead, type SubmitLeadResult } from "@/server/modules/leads/leads.service";

export type LeadFormState = SubmitLeadResult | null;

export async function submitLeadAction(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: los bots llenan campos ocultos; respondemos "ok" sin enviar nada.
  if (formData.get("website")) return { ok: true };
  formData.delete("website");

  // Campos opcionales vacíos se omiten para que Zod los trate como ausentes.
  for (const key of ["notes", "recaptchaToken", "allergies", "decoration"]) {
    if (formData.get(key) === "") formData.delete(key);
  }
  // Sin alergias, el detalle no aplica aunque se haya escrito algo.
  if (formData.get("hasAllergies") === "no") formData.delete("allergies");

  return submitLead(Object.fromEntries(formData.entries()));
}
