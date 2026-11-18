import { describe, expect, it } from "vitest";

import { leadRequestSchema } from "@/lib/schemas/lead";
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
    expect(lead.guests).toBe(120);
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
