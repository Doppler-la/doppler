import type Anthropic from "@anthropic-ai/sdk";

export type Brief = {
  name: string;
  company: string;
  email: string;
  phone: string;
  availability: string;
  problemSummary: string;
  currentProcess: string;
  toolsAndSystems: string;
  volume: string;
  impact: string;
  desiredOutcome: string;
  constraints: string;
  openQuestions: string[];
  referralSource: string;
  suggestedKpis: string[];
};

export type BriefResult = { ok: true; brief: Brief } | { ok: false; error: string };

const NOT_REPORTED = "No informado";
const FIELD_MAX = 2000;
const KPI_COUNT = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const detailProperty = (description: string) => ({
  type: "string",
  description: `${description} Si el cliente no lo dijo escribí "No informado"; si decidió omitirlo, "Omitido por el cliente".`,
});

export const BRIEF_TOOL: Anthropic.Tool = {
  name: "submit_brief",
  description:
    "Envía al equipo de Doppler el brief de descubrimiento. Llamala una sola vez, cuando ya tengas nombre, un medio de contacto, horarios disponibles y hayas hecho las repreguntas sobre el problema.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Nombre de la persona." },
      company: { type: "string", description: "Empresa o negocio (opcional)." },
      email: { type: "string", description: "Email de contacto (opcional si hay teléfono)." },
      phone: { type: "string", description: "Teléfono de contacto (opcional si hay email)." },
      availability: {
        type: "string",
        description: "Días y franjas horarias en que la persona puede tener la reunión.",
      },
      problem_summary: {
        type: "string",
        description: "Resumen del problema con las palabras del cliente. No agregues soluciones.",
      },
      current_process: detailProperty("Cómo resuelven hoy el problema, paso a paso y quién participa."),
      tools_and_systems: detailProperty("Herramientas y sistemas que usan hoy (ERP, CRM, Excel, ecommerce)."),
      volume: detailProperty("Volumen: operaciones, usuarios o pedidos."),
      impact: detailProperty("Impacto del problema: costo, tiempo perdido, errores."),
      desired_outcome: detailProperty("Resultado que esperan lograr."),
      constraints: detailProperty("Restricciones: plazos, presupuesto, integraciones obligatorias."),
      referral_source: {
        type: "string",
        description:
          'Cómo conoció a Doppler (redes, recomendación, búsqueda, evento, etc.). Si decidió no responder, escribí "Omitido por el cliente".',
      },
      suggested_kpis: {
        type: "array",
        items: { type: "string" },
        description:
          "Exactamente 3 KPIs principales para empezar a medir en el negocio que describió el cliente. Cada uno: nombre del KPI y, tras un guion, qué mide y por qué le sirve a su caso. Uso interno: no se los cuentes al cliente.",
      },
      open_questions: {
        type: "array",
        items: { type: "string" },
        description:
          "Preguntas para hacer en la reunión: lo que el cliente omitió y los huecos que detectaste.",
      },
    },
    required: [
      "name",
      "availability",
      "problem_summary",
      "referral_source",
      "suggested_kpis",
    ],
  },
};

function text(value: unknown, max = FIELD_MAX): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function detail(value: unknown): string {
  return text(value) || NOT_REPORTED;
}

export function parseBrief(input: unknown): BriefResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "El brief debe ser un objeto." };
  }
  const raw = input as Record<string, unknown>;

  const name = text(raw.name, 200);
  const availability = text(raw.availability);
  const problemSummary = text(raw.problem_summary);
  if (!name) return { ok: false, error: "Falta el nombre de la persona." };
  if (!availability) return { ok: false, error: "Faltan los horarios disponibles." };
  if (!problemSummary) return { ok: false, error: "Falta el resumen del problema." };

  const email = text(raw.email, 200);
  const phone = text(raw.phone, 60);
  const emailOk = EMAIL_REGEX.test(email);
  const phoneOk = phone.replace(/\D/g, "").length >= 6;
  if (email && !emailOk) return { ok: false, error: "El email no es válido: pedíselo de nuevo." };
  if (!emailOk && !phoneOk) {
    return { ok: false, error: "Falta un email o teléfono válido: pedíselo a la persona." };
  }

  const referralSource = text(raw.referral_source, 300);
  if (!referralSource) {
    return {
      ok: false,
      error: "Falta preguntar cómo nos conoció: preguntáselo (puede omitirlo) antes de enviar.",
    };
  }

  const kpis = Array.isArray(raw.suggested_kpis)
    ? raw.suggested_kpis.map((k) => text(k, 300)).filter(Boolean)
    : [];
  if (kpis.length < KPI_COUNT) {
    return {
      ok: false,
      error: `Faltan KPIs: sugerí ${KPI_COUNT} KPIs principales según el negocio que describió el cliente.`,
    };
  }

  const openQuestions = Array.isArray(raw.open_questions)
    ? raw.open_questions
        .map((q) => text(q, 300))
        .filter(Boolean)
        .slice(0, 10)
    : [];

  return {
    ok: true,
    brief: {
      name,
      company: text(raw.company, 200),
      email: emailOk ? email : "",
      phone: phoneOk ? phone : "",
      availability,
      problemSummary,
      currentProcess: detail(raw.current_process),
      toolsAndSystems: detail(raw.tools_and_systems),
      volume: detail(raw.volume),
      impact: detail(raw.impact),
      desiredOutcome: detail(raw.desired_outcome),
      constraints: detail(raw.constraints),
      openQuestions,
      referralSource,
      suggestedKpis: kpis.slice(0, KPI_COUNT),
    },
  };
}
