import { NextResponse } from "next/server";
import { Resend } from "resend";
import type Anthropic from "@anthropic-ai/sdk";
import { BRIEF_TOOL, parseBrief, type Brief } from "@/lib/agent/brief";
import { streamTurn } from "@/lib/agent/claude";
import { buildBriefEmail } from "@/lib/agent/email";
import { countUserMessages, parseHistory, type ChatMessage } from "@/lib/agent/history";
import { MIN_USER_MESSAGES_FOR_BRIEF, WRAP_UP_USER_MESSAGES } from "@/lib/agent/limits";
import { buildSystemPrompt } from "@/lib/agent/prompt";
import { allowRequest } from "@/lib/agent/rateLimit";
import { CONTACT_RECIPIENTS } from "@/lib/recipients";

export const maxDuration = 60;

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_TURNS = 4;

type StreamEvent =
  | { type: "text"; text: string }
  | { type: "brief"; subject: string; text: string }
  | { type: "done"; submitted: boolean }
  | { type: "error"; message: string };

type SubmitOutcome = { sent: boolean; message: string };

// Solo desarrollo: muestra el brief en la web en vez de enviarlo. Nunca en producción.
function previewEnabled(): boolean {
  return process.env.CHAT_PREVIEW_BRIEF === "true" && process.env.NODE_ENV !== "production";
}

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function sendBriefEmail(brief: Brief, transcript: ChatMessage[]): Promise<boolean> {
  const { subject, text } = buildBriefEmail(brief, transcript);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { error } = await resend.emails.send({
        from: "Doppler <no-reply@doppler.la>",
        to: CONTACT_RECIPIENTS,
        ...(brief.email ? { replyTo: brief.email } : {}),
        subject,
        text,
      });
      if (!error) return true;
      console.error("Error enviando el brief:", error);
    } catch (error) {
      console.error("Error enviando el brief:", error);
    }
  }
  // Último recurso: que el brief no se pierda en silencio.
  console.error("Brief no enviado:\n", text);
  return false;
}

async function handleSubmitBrief(
  input: unknown,
  history: ChatMessage[],
  send: (event: StreamEvent) => void
): Promise<SubmitOutcome> {
  if (countUserMessages(history) < MIN_USER_MESSAGES_FOR_BRIEF) {
    return {
      sent: false,
      message:
        "Todavía no podés enviar el brief: faltan repreguntas sobre el problema y pedir contacto y horarios. Seguí con la conversación.",
    };
  }
  const parsed = parseBrief(input);
  if (!parsed.ok) return { sent: false, message: parsed.error };

  if (previewEnabled()) {
    const { subject, text } = buildBriefEmail(parsed.brief, history);
    send({ type: "brief", subject, text });
    return {
      sent: true,
      message: "Brief enviado al equipo. Despedite en un mensaje corto, sin hacer más preguntas.",
    };
  }

  const sent = await sendBriefEmail(parsed.brief, history);
  return sent
    ? {
        sent: true,
        message: "Brief enviado al equipo. Despedite en un mensaje corto, sin hacer más preguntas.",
      }
    : {
        sent: false,
        message:
          "No se pudo enviar el brief por un problema técnico. Pedile disculpas y sugerile que use el formulario que aparece debajo del chat.",
      };
}

type AgentState = { submitted: boolean };

async function runAgent(
  history: ChatMessage[],
  send: (event: StreamEvent) => void,
  state: AgentState
): Promise<void> {
  const onText = (text: string) => send({ type: "text", text });
  const system = buildSystemPrompt({
    wrapUp: countUserMessages(history) >= WRAP_UP_USER_MESSAGES,
  });
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  let emitted = false;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    // El texto de turnos consecutivos se separa para que no quede pegado en la misma burbuja.
    let pendingSeparator = emitted;
    const reply = await streamTurn({
      system,
      messages,
      onText: (text) => {
        if (pendingSeparator) {
          onText("\n\n");
          pendingSeparator = false;
        }
        onText(text);
      },
    });
    if (reply.stop_reason === "refusal") throw new Error("refusal");
    if (reply.content.some((block) => block.type === "text" && block.text.trim())) {
      emitted = true;
    }

    const calls = reply.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );
    if (calls.length === 0) {
      // Una respuesta sin texto dejaría una burbuja vacía que el servidor rechaza en el próximo mensaje.
      if (!emitted && !state.submitted) throw new Error("empty_reply");
      return;
    }

    messages.push({ role: "assistant", content: reply.content });
    // La API exige un tool_result por cada tool_use, también si el modelo llama en paralelo.
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const call of calls) {
      let content: string;
      let isError = false;
      if (call.name !== BRIEF_TOOL.name) {
        content = "Herramienta desconocida: solo podés usar submit_brief.";
        isError = true;
      } else if (state.submitted) {
        content = "El brief ya fue enviado. No hagas más preguntas.";
      } else {
        const outcome = await handleSubmitBrief(call.input, history, send);
        if (outcome.sent) state.submitted = true;
        content = outcome.message;
        isError = !outcome.sent;
      }
      results.push({ type: "tool_result", tool_use_id: call.id, content, is_error: isError });
    }
    messages.push({ role: "user", content: results });
  }

  // Si el brief ya salió, el visitante no debe ver un error que lo lleve a reenviarlo.
  if (!state.submitted) throw new Error("too_many_turns");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const parsed = parseHistory(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const history = parsed.messages;

  const allowed = await allowRequest(clientIp(request), countUserMessages(history) === 1);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      const state: AgentState = { submitted: false };
      try {
        await runAgent(history, send, state);
        send({ type: "done", submitted: state.submitted });
      } catch (error) {
        console.error("Error en el chat:", error);
        // Con el brief ya enviado un error no debe hacer que el visitante reintente (duplicaría el email).
        send(
          state.submitted
            ? { type: "done", submitted: true }
            : { type: "error", message: "agent_unavailable" }
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
