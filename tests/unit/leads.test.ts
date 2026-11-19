import { describe, expect, it } from "vitest";

import { businessDatePlusDays } from "@/lib/dates";
import { leadRequestSchema, minCakeDate } from "@/lib/schemas/lead";
import {
  buildCustomerAckEmail,
  buildInternalLeadEmail,
} from "@/server/modules/leads/lead-email";

const valid = {
  type: "catering",
  name: "Ana López",
  email: "ana@example.com",
  phone: "55 1234 5678",
  eventDate: "2026-12-20",
  guests: "120",
  location: "Coyoacán, CDMX",
};

describe("leadRequestSchema", () => {
  it("acepta una solicitud válida y convierte invitados a número", () => {
    const lead = leadRequestSchema.parse(valid);
    expect(lead.type !== "pastel" && lead.guests).toBe(120);
  });

  it("rechaza correos inválidos", () => {
    expect(leadRequestSchema.safeParse({ ...valid, email: "ana@" }).success).toBe(false);
  });

  it("rechaza 0 invitados", () => {
    expect(leadRequestSchema.safeParse({ ...valid, guests: "0" }).success).toBe(false);
  });

  it("rechaza tipos desconocidos", () => {
    expect(leadRequestSchema.safeParse({ ...valid, type: "boda" }).success).toBe(false);
  });
});

describe("correos de solicitud", () => {
  it("escapa HTML en datos del cliente", () => {
    const lead = leadRequestSchema.parse({
      ...valid,
      name: "<script>alert(1)</script>",
    });
    const { html } = buildInternalLeadEmail(lead);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("incluye tipo y fecha en el asunto interno", () => {
    const lead = leadRequestSchema.parse(valid);
    expect(buildInternalLeadEmail(lead).subject).toContain("Catering");
    expect(buildInternalLeadEmail(lead).subject).toContain("2026-12-20");
  });

  it("saluda al cliente por su nombre", () => {
    const lead = leadRequestSchema.parse(valid);
    expect(buildCustomerAckEmail(lead).text).toMatch(/^Hola Ana López/);
  });
});

const cake = {
  type: "pastel",
  name: "Ana López",
  email: "ana@example.com",
  phone: "55 1234 5678",
  eventDate: "2099-12-20",
  size: "8",
  flavor: "zanahoria",
  hasAllergies: "no",
};

describe("solicitud de pastel", () => {
  it("acepta una solicitud válida sin alergias", () => {
    expect(leadRequestSchema.safeParse(cake).success).toBe(true);
  });

  it("rechaza tamaños y sabores fuera del menú", () => {
    expect(leadRequestSchema.safeParse({ ...cake, size: "10" }).success).toBe(false);
    expect(leadRequestSchema.safeParse({ ...cake, flavor: "fresa" }).success).toBe(false);
  });

  it("pide el detalle cuando hay alergias", () => {
    const res = leadRequestSchema.safeParse({ ...cake, hasAllergies: "si" });
    expect(res.success).toBe(false);
    expect(res.error?.issues[0]?.path).toEqual(["allergies"]);
    expect(
      leadRequestSchema.safeParse({ ...cake, hasAllergies: "si", allergies: "nuez" }).success,
    ).toBe(true);
  });

  it("exige 48 horas de anticipación", () => {
    const today = businessDatePlusDays(new Date(), 0);
    const tomorrow = businessDatePlusDays(new Date(), 1);
    for (const eventDate of [today, tomorrow]) {
      const res = leadRequestSchema.safeParse({ ...cake, eventDate });
      expect(res.success).toBe(false);
      expect(res.error?.issues[0]?.path).toEqual(["eventDate"]);
    }
    expect(leadRequestSchema.safeParse({ ...cake, eventDate: minCakeDate() }).success).toBe(true);
  });

  it("no exige invitados ni ubicación", () => {
    expect(leadRequestSchema.safeParse(cake).success).toBe(true);
  });

  it("arma el correo interno con tamaño, sabor y alergias", () => {
    const lead = leadRequestSchema.parse({ ...cake, hasAllergies: "si", allergies: "nuez" });
    const { subject, text } = buildInternalLeadEmail(lead);
    expect(subject).toContain("Pastel");
    expect(text).toContain("Tamaño: 8 personas");
    expect(text).toContain("Sabor: Zanahoria");
    expect(text).toContain("Intolerancias o alergias: Sí: nuez");
  });

  it("acusa recibo de la solicitud de pastel", () => {
    const lead = leadRequestSchema.parse(cake);
    expect(buildCustomerAckEmail(lead).subject).toContain("pastel");
  });
});

describe("businessDatePlusDays", () => {
  it("usa la fecha de CDMX, no la de UTC", () => {
    // 2026-11-19 03:00 UTC = 2026-11-18 21:00 en CDMX
    const now = new Date("2026-11-19T03:00:00Z");
    expect(businessDatePlusDays(now, 0)).toBe("2026-11-18");
    expect(businessDatePlusDays(now, 2)).toBe("2026-11-20");
  });

  it("cruza fin de mes y de año", () => {
    const now = new Date("2026-12-31T18:00:00Z");
    expect(businessDatePlusDays(now, 2)).toBe("2027-01-02");
  });
});
