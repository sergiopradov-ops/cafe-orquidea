import { describe, expect, it } from "vitest";

import { resolveEmailMode } from "@/server/modules/notifications/email.mode";

describe("resolveEmailMode", () => {
  it("envía cuando hay llave, en cualquier entorno", () => {
    expect(resolveEmailMode({ isProduction: true, resendApiKey: "re_x" })).toBe("send");
    expect(resolveEmailMode({ isProduction: false, resendApiKey: "re_x" })).toBe("send");
  });

  it("en producción sin llave es un error, no un envío silencioso", () => {
    expect(resolveEmailMode({ isProduction: true, resendApiKey: undefined })).toBe(
      "misconfigured",
    );
  });

  it("en local sin llave solo escribe en el log", () => {
    expect(resolveEmailMode({ isProduction: false, resendApiKey: undefined })).toBe("log");
  });
});
