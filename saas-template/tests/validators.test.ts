import { describe, expect, it } from "vitest";
import { emailSchema, moneyAmountSchema, percentSchema } from "@/lib/validators";

describe("validators genéricos", () => {
  it("acepta un email válido y lo normaliza a minúsculas", () => {
    expect(emailSchema.parse("Persona@Ejemplo.COM")).toBe("persona@ejemplo.com");
  });

  it("rechaza un email inválido", () => {
    expect(() => emailSchema.parse("no-es-un-email")).toThrow();
  });

  it("rechaza un porcentaje mayor a 100", () => {
    expect(() => percentSchema.parse(150)).toThrow();
  });

  it("rechaza un monto negativo", () => {
    expect(() => moneyAmountSchema.parse(-10)).toThrow();
  });
});
