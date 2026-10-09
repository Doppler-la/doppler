import { describe, it, expect } from "vitest";
import { buildBriefEmail } from "./email";
import type { Brief } from "./brief";

const brief: Brief = {
  name: "Ana Pérez",
  company: "Panadería Sol",
  email: "ana@empresa.com",
  phone: "",
  availability: "Martes por la tarde",
  problemSummary: "Cargan pedidos a mano.",
  currentProcess: "Copian desde WhatsApp a un Excel.",
  toolsAndSystems: "Excel",
  volume: "Omitido por el cliente",
  impact: "No informado",
  desiredOutcome: "Que se cargue solo",
  constraints: "No informado",
  openQuestions: ["¿Cuántos pedidos por día?"],
  referralSource: "Instagram",
  suggestedKpis: ["Pedidos perdidos por semana", "Tiempo de carga por pedido", "Pedidos a tiempo"],
  businessKpis: ["Ventas recuperadas", "Margen por pedido", "Recompra de clientes"],
};

const transcript = [
  { role: "user" as const, content: "Cargo pedidos a mano" },
  { role: "assistant" as const, content: "¿Con qué herramientas?" },
  { role: "user" as const, content: "Excel" },
];

describe("buildBriefEmail", () => {
  it("builds a subject with the name and company", () => {
    const { subject } = buildBriefEmail(brief, transcript);
    expect(subject).toBe("Nuevo brief de descubrimiento: Ana Pérez (Panadería Sol)");
  });

  it("keeps the subject on a single line even if the name has line breaks", () => {
    const { subject } = buildBriefEmail({ ...brief, name: "Ana\r\nBcc: x@y.com" }, transcript);
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it("includes the channel, contact, problem data, open questions and transcript", () => {
    const { text } = buildBriefEmail(brief, transcript);
    expect(text).toContain("Canal de contacto: chat con el agente");
    expect(text).toContain("Email: ana@empresa.com");
    expect(text).toContain("Horarios disponibles: Martes por la tarde");
    expect(text).toContain("Cargan pedidos a mano.");
    expect(text).toContain("Volumen: Omitido por el cliente");
    expect(text).toContain("- ¿Cuántos pedidos por día?");
    expect(text).toContain("Cliente: Cargo pedidos a mano");
    expect(text).toContain("Agente: ¿Con qué herramientas?");
  });

  it("includes how the client found us and the 3 suggested KPIs for internal use", () => {
    const { text } = buildBriefEmail(brief, transcript);
    expect(text).toContain("Cómo nos conoció: Instagram");
    expect(text).toContain("KPIS SUGERIDOS (uso interno");
    expect(text).toContain("1. Pedidos perdidos por semana");
    expect(text).toContain("2. Tiempo de carga por pedido");
    expect(text).toContain("3. Pedidos a tiempo");
  });

  it("lists the operational and the business KPIs in separate groups", () => {
    const { text } = buildBriefEmail(brief, transcript);
    const operational = text.indexOf("Operativos:");
    const business = text.indexOf("De negocio:");
    expect(operational).toBeGreaterThan(-1);
    expect(business).toBeGreaterThan(operational);
    expect(text.slice(business)).toContain("1. Ventas recuperadas");
    expect(text.slice(business)).toContain("3. Recompra de clientes");
  });

  it("does not include solution hypotheses", () => {
    const { text } = buildBriefEmail(brief, transcript);
    expect(text.toLowerCase()).not.toContain("hipótesis");
  });

  it("shows the phone when there is no email", () => {
    const { text } = buildBriefEmail({ ...brief, email: "", phone: "+54 11 5555-1234" }, transcript);
    expect(text).toContain("Teléfono: +54 11 5555-1234");
    expect(text).not.toContain("Email:");
  });
});
