import { describe, it, expect } from "vitest";
import { BRIEF_TOOL, parseBrief } from "./brief";

const valid = {
  name: "Ana Pérez",
  email: "ana@empresa.com",
  availability: "Martes y jueves por la tarde",
  problem_summary: "Cargan pedidos a mano desde WhatsApp al sistema de gestión.",
  referral_source: "Instagram",
  suggested_kpis: [
    "Pedidos perdidos por semana",
    "Tiempo de carga de un pedido",
    "Pedidos entregados a tiempo",
  ],
  business_kpis: [
    "Ventas recuperadas por pedidos que ya no se pierden",
    "Margen por pedido",
    "Recompra de clientes",
  ],
};

describe("BRIEF_TOOL", () => {
  it("is named submit_brief", () => {
    expect(BRIEF_TOOL.name).toBe("submit_brief");
  });
});

describe("parseBrief", () => {
  it("accepts the minimal valid input and defaults the detail fields", () => {
    const result = parseBrief(valid);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.brief.name).toBe("Ana Pérez");
    expect(result.brief.company).toBe("");
    expect(result.brief.email).toBe("ana@empresa.com");
    expect(result.brief.volume).toBe("No informado");
    expect(result.brief.openQuestions).toEqual([]);
    expect(result.brief.referralSource).toBe("Instagram");
    expect(result.brief.suggestedKpis).toHaveLength(3);
    expect(result.brief.businessKpis).toHaveLength(3);
  });

  it("rejects a missing referral source but accepts an omitted one as an answer", () => {
    expect(parseBrief({ ...valid, referral_source: undefined }).ok).toBe(false);
    expect(parseBrief({ ...valid, referral_source: "  " }).ok).toBe(false);
    expect(parseBrief({ ...valid, referral_source: "Omitido por el cliente" }).ok).toBe(true);
  });

  it("requires 3 suggested KPIs", () => {
    expect(parseBrief({ ...valid, suggested_kpis: undefined }).ok).toBe(false);
    expect(parseBrief({ ...valid, suggested_kpis: ["uno", "dos"] }).ok).toBe(false);
    expect(parseBrief({ ...valid, suggested_kpis: ["uno", 5, null, ""] }).ok).toBe(false);
  });

  it("requires 3 business KPIs", () => {
    expect(parseBrief({ ...valid, business_kpis: undefined }).ok).toBe(false);
    expect(parseBrief({ ...valid, business_kpis: ["uno", "dos"] }).ok).toBe(false);
    expect(parseBrief({ ...valid, business_kpis: ["uno", 5, null, ""] }).ok).toBe(false);
  });

  it("keeps only the first 3 business KPIs, truncated to 300 characters", () => {
    const result = parseBrief({ ...valid, business_kpis: ["a".repeat(400), "b", "c", "d"] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.brief.businessKpis).toEqual(["a".repeat(300), "b", "c"]);
  });

  it("keeps only the first 3 KPIs, truncated to 300 characters", () => {
    const kpis = ["a".repeat(400), "b", "c", "d", "e"];
    const result = parseBrief({ ...valid, suggested_kpis: kpis });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.brief.suggestedKpis).toEqual(["a".repeat(300), "b", "c"]);
  });

  it("accepts a phone number instead of an email", () => {
    const result = parseBrief({ ...valid, email: undefined, phone: "+54 9 11 5555-1234" });
    expect(result.ok).toBe(true);
  });

  it("rejects input that is not an object", () => {
    expect(parseBrief("hola").ok).toBe(false);
    expect(parseBrief(null).ok).toBe(false);
  });

  it("rejects a missing name, availability or problem summary", () => {
    expect(parseBrief({ ...valid, name: " " }).ok).toBe(false);
    expect(parseBrief({ ...valid, availability: undefined }).ok).toBe(false);
    expect(parseBrief({ ...valid, problem_summary: "" }).ok).toBe(false);
  });

  it("rejects contact data that is neither a valid email nor a valid phone", () => {
    expect(parseBrief({ ...valid, email: "no-es-email" }).ok).toBe(false);
    expect(parseBrief({ ...valid, email: undefined, phone: "123" }).ok).toBe(false);
    expect(parseBrief({ ...valid, email: undefined }).ok).toBe(false);
  });

  it("keeps at most 10 open questions of at most 300 characters", () => {
    const questions = Array.from({ length: 12 }, (_, i) => `Pregunta ${i} ${"x".repeat(400)}`);
    const result = parseBrief({ ...valid, open_questions: questions });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.brief.openQuestions).toHaveLength(10);
    expect(result.brief.openQuestions[0].length).toBe(300);
  });

  it("ignores open questions that are not strings", () => {
    const result = parseBrief({ ...valid, open_questions: ["¿Cuántos usuarios?", 5, null, ""] });
    expect(result.ok && result.brief.openQuestions).toEqual(["¿Cuántos usuarios?"]);
  });
});
