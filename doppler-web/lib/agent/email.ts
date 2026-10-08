import type { Brief } from "./brief";
import type { ChatMessage } from "./history";

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function buildBriefEmail(
  brief: Brief,
  transcript: ChatMessage[]
): { subject: string; text: string } {
  const company = brief.company ? ` (${brief.company})` : "";
  const subject = oneLine(`Nuevo brief de descubrimiento: ${brief.name}${company}`);

  const contactLines = [
    `Nombre: ${brief.name}`,
    brief.company && `Empresa: ${brief.company}`,
    brief.email && `Email: ${brief.email}`,
    brief.phone && `Teléfono: ${brief.phone}`,
    `Cómo nos conoció: ${brief.referralSource}`,
    `Horarios disponibles: ${brief.availability}`,
  ].filter(Boolean);

  const questions = brief.openQuestions.length
    ? brief.openQuestions.map((q) => `- ${q}`).join("\n")
    : "- (ninguna)";

  const log = transcript
    .map((m) => `${m.role === "user" ? "Cliente" : "Agente"}: ${m.content}`)
    .join("\n\n");

  const text = [
    "Canal de contacto: chat con el agente",
    "",
    "CONTACTO",
    ...contactLines,
    "",
    "PROBLEMA (en palabras del cliente)",
    brief.problemSummary,
    "",
    "DATOS RELEVADOS",
    `Proceso actual: ${brief.currentProcess}`,
    `Herramientas y sistemas: ${brief.toolsAndSystems}`,
    `Volumen: ${brief.volume}`,
    `Impacto: ${brief.impact}`,
    `Resultado esperado: ${brief.desiredOutcome}`,
    `Restricciones: ${brief.constraints}`,
    "",
    "KPIS SUGERIDOS (uso interno: los presenta una persona del equipo en la reunión)",
    ...brief.suggestedKpis.map((kpi, i) => `${i + 1}. ${kpi}`),
    "",
    "PREGUNTAS ABIERTAS PARA LA REUNIÓN",
    questions,
    "",
    "TRANSCRIPCIÓN COMPLETA",
    log,
  ].join("\n");

  return { subject, text };
}
