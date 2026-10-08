import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const streamTurn = vi.fn();
vi.mock("@/lib/agent/claude", () => ({ streamTurn }));

const allowRequest = vi.fn();
vi.mock("@/lib/agent/rateLimit", () => ({ allowRequest }));

const { POST } = await import("./route");

const validBrief = {
  name: "Ana Pérez",
  email: "ana@empresa.com",
  availability: "Martes por la tarde",
  problem_summary: "Cargan pedidos a mano.",
  referral_source: "Instagram",
  suggested_kpis: ["Pedidos perdidos por semana", "Tiempo de carga", "Pedidos a tiempo"],
  business_kpis: ["Ventas recuperadas", "Margen por pedido", "Recompra de clientes"],
};

function textReply(text: string) {
  return { stop_reason: "end_turn", content: [{ type: "text", text }] };
}

function toolReply(input: unknown) {
  return {
    stop_reason: "tool_use",
    content: [{ type: "tool_use", id: "tu_1", name: "submit_brief", input }],
  };
}

// Historial con `n` mensajes del cliente, alternado y terminado en un mensaje del cliente.
function history(n: number) {
  const messages: { role: string; content: string }[] = [];
  for (let i = 0; i < n; i++) {
    messages.push({ role: "user", content: `cliente ${i}` });
    if (i < n - 1) messages.push({ role: "assistant", content: `agente ${i}` });
  }
  return messages;
}

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "9.9.9.9" },
    body: JSON.stringify(body),
  });
}

async function readEvents(res: Response) {
  const raw = await res.text();
  return raw
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    streamTurn.mockReset();
    send.mockReset().mockResolvedValue({ data: { id: "test" }, error: null });
    allowRequest.mockReset().mockResolvedValue(true);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 400 for an invalid body or history without calling the model", async () => {
    const res = await POST(makeRequest({ messages: [{ role: "system", content: "x" }] }));
    expect(res.status).toBe(400);
    expect(streamTurn).not.toHaveBeenCalled();
  });

  it("returns 400 when the conversation is too long", async () => {
    const res = await POST(makeRequest({ messages: history(13) }));
    expect(res.status).toBe(400);
    expect(streamTurn).not.toHaveBeenCalled();
  });

  it("returns 429 when the rate limit is exceeded", async () => {
    allowRequest.mockResolvedValue(false);
    const res = await POST(makeRequest({ messages: history(1) }));
    expect(res.status).toBe(429);
    expect(streamTurn).not.toHaveBeenCalled();
  });

  it("flags a new conversation to the rate limiter only on the first user message", async () => {
    streamTurn.mockResolvedValue(textReply("Hola"));
    await (await POST(makeRequest({ messages: history(1) }))).text();
    await (await POST(makeRequest({ messages: history(2) }))).text();
    expect(allowRequest).toHaveBeenNthCalledWith(1, "9.9.9.9", true);
    expect(allowRequest).toHaveBeenNthCalledWith(2, "9.9.9.9", false);
  });

  it("streams the reply text and finishes with submitted:false", async () => {
    streamTurn.mockImplementation(async ({ onText }) => {
      onText("¿Cómo lo hacen hoy?");
      return textReply("¿Cómo lo hacen hoy?");
    });
    const res = await POST(makeRequest({ messages: history(1) }));
    expect(res.headers.get("Content-Type")).toContain("application/x-ndjson");
    expect(await readEvents(res)).toEqual([
      { type: "text", text: "¿Cómo lo hacen hoy?" },
      { type: "done", submitted: false },
    ]);
  });

  it("does not add the wrap-up instruction early but does from 6 user messages", async () => {
    streamTurn.mockResolvedValue(textReply("ok"));
    await (await POST(makeRequest({ messages: history(2) }))).text();
    await (await POST(makeRequest({ messages: history(6) }))).text();
    expect(streamTurn.mock.calls[0][0].system).not.toContain("YA NO HAGAS MÁS PREGUNTAS");
    expect(streamTurn.mock.calls[1][0].system).toContain("YA NO HAGAS MÁS PREGUNTAS");
  });

  it("rejects submit_brief before enough user messages and lets the model keep asking", async () => {
    streamTurn
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockResolvedValueOnce(textReply("Antes, ¿cuántos pedidos por día?"));
    const res = await POST(makeRequest({ messages: history(3) }));
    const events = await readEvents(res);
    expect(send).not.toHaveBeenCalled();
    expect(events.at(-1)).toEqual({ type: "done", submitted: false });
    const secondCallMessages = streamTurn.mock.calls[1][0].messages;
    const toolResult = secondCallMessages.at(-1).content[0];
    expect(toolResult).toMatchObject({ type: "tool_result", tool_use_id: "tu_1", is_error: true });
  });

  it("sends the email and finishes with submitted:true when the brief is accepted", async () => {
    streamTurn
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockImplementationOnce(async ({ onText }) => {
        onText("¡Gracias, Ana!");
        return textReply("¡Gracias, Ana!");
      });
    const res = await POST(makeRequest({ messages: history(4) }));
    const events = await readEvents(res);

    expect(send).toHaveBeenCalledTimes(1);
    const email = send.mock.calls[0][0];
    expect(email.to).toEqual(["dsalamone@doppler.la", "iirigoitia@doppler.la"]);
    expect(email.replyTo).toBe("ana@empresa.com");
    expect(email.subject).toContain("Ana Pérez");
    expect(email.text).toContain("Canal de contacto: chat con el agente");
    expect(email.text).toContain("Cliente: cliente 0");
    expect(events).toEqual([
      { type: "text", text: "¡Gracias, Ana!" },
      { type: "done", submitted: true },
    ]);
  });

  it("does not send an email when the brief has no valid contact", async () => {
    streamTurn
      .mockResolvedValueOnce(toolReply({ ...validBrief, email: undefined }))
      .mockResolvedValueOnce(textReply("¿Me pasás un email o teléfono?"));
    await (await POST(makeRequest({ messages: history(4) }))).text();
    expect(send).not.toHaveBeenCalled();
    const toolResult = streamTurn.mock.calls[1][0].messages.at(-1).content[0];
    expect(toolResult.is_error).toBe(true);
  });

  it("does not send an email when the brief lacks the 3 KPIs or the referral source", async () => {
    streamTurn
      .mockResolvedValueOnce(toolReply({ ...validBrief, suggested_kpis: ["uno"] }))
      .mockResolvedValueOnce(toolReply({ ...validBrief, referral_source: undefined }))
      .mockResolvedValueOnce(toolReply({ ...validBrief, business_kpis: undefined }))
      .mockResolvedValueOnce(textReply("Seguimos."));
    await (await POST(makeRequest({ messages: history(4) }))).text();
    expect(send).not.toHaveBeenCalled();
    const results = streamTurn.mock.calls[3][0].messages.at(-1).content;
    expect(results[0].is_error).toBe(true);
  });

  it("sends only one email if the model calls submit_brief twice", async () => {
    streamTurn
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockResolvedValueOnce(textReply("Listo."));
    const res = await POST(makeRequest({ messages: history(4) }));
    const events = await readEvents(res);
    expect(send).toHaveBeenCalledTimes(1);
    expect(events.at(-1)).toEqual({ type: "done", submitted: true });
  });

  it("retries the email once and reports submitted:false if it keeps failing", async () => {
    send.mockResolvedValue({ data: null, error: { message: "fail" } });
    streamTurn
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockResolvedValueOnce(textReply("Hubo un problema, usá el formulario."));
    const res = await POST(makeRequest({ messages: history(4) }));
    const events = await readEvents(res);
    expect(send).toHaveBeenCalledTimes(2);
    expect(events.at(-1)).toEqual({ type: "done", submitted: false });
  });

  it("emits an error event when the model call fails", async () => {
    streamTurn.mockRejectedValue(new Error("timeout"));
    const res = await POST(makeRequest({ messages: history(1) }));
    expect(await readEvents(res)).toEqual([{ type: "error", message: "agent_unavailable" }]);
  });

  it("emits an error event when the model refuses", async () => {
    streamTurn.mockResolvedValue({ stop_reason: "refusal", content: [] });
    const res = await POST(makeRequest({ messages: history(1) }));
    expect(await readEvents(res)).toEqual([{ type: "error", message: "agent_unavailable" }]);
  });

  it("answers every tool_use of a parallel call and sends only one email", async () => {
    streamTurn
      .mockResolvedValueOnce({
        stop_reason: "tool_use",
        content: [
          { type: "tool_use", id: "tu_1", name: "submit_brief", input: validBrief },
          { type: "tool_use", id: "tu_2", name: "submit_brief", input: validBrief },
        ],
      })
      .mockResolvedValueOnce(textReply("Listo."));
    const res = await POST(makeRequest({ messages: history(4) }));
    const events = await readEvents(res);

    expect(send).toHaveBeenCalledTimes(1);
    const results = streamTurn.mock.calls[1][0].messages.at(-1).content;
    expect(results.map((r: { tool_use_id: string }) => r.tool_use_id)).toEqual(["tu_1", "tu_2"]);
    expect(events.at(-1)).toEqual({ type: "done", submitted: true });
  });

  it("rejects unknown tools without sending an email", async () => {
    streamTurn
      .mockResolvedValueOnce({
        stop_reason: "tool_use",
        content: [{ type: "tool_use", id: "tu_x", name: "delete_everything", input: {} }],
      })
      .mockResolvedValueOnce(textReply("Perdón, sigo con tus datos."));
    await (await POST(makeRequest({ messages: history(4) }))).text();
    expect(send).not.toHaveBeenCalled();
    const result = streamTurn.mock.calls[1][0].messages.at(-1).content[0];
    expect(result).toMatchObject({ tool_use_id: "tu_x", is_error: true });
  });

  it("reports submitted:true when the model call fails after the email was sent", async () => {
    streamTurn
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockRejectedValueOnce(new Error("timeout"));
    const res = await POST(makeRequest({ messages: history(4) }));
    const events = await readEvents(res);
    expect(send).toHaveBeenCalledTimes(1);
    expect(events.at(-1)).toEqual({ type: "done", submitted: true });
  });

  it("reports submitted:true when the turn limit is reached after the email was sent", async () => {
    streamTurn.mockResolvedValue(toolReply(validBrief));
    const res = await POST(makeRequest({ messages: history(4) }));
    const events = await readEvents(res);
    expect(send).toHaveBeenCalledTimes(1);
    expect(events.at(-1)).toEqual({ type: "done", submitted: true });
  });

  it("emits an error event when the model produced no text and nothing was submitted", async () => {
    streamTurn.mockResolvedValue({ stop_reason: "max_tokens", content: [] });
    const res = await POST(makeRequest({ messages: history(1) }));
    expect(await readEvents(res)).toEqual([{ type: "error", message: "agent_unavailable" }]);
  });

  it("separates the text of consecutive turns", async () => {
    streamTurn
      .mockImplementationOnce(async ({ onText }) => {
        onText("Listo, ya tengo todo.");
        return {
          stop_reason: "tool_use",
          content: [
            { type: "text", text: "Listo, ya tengo todo." },
            { type: "tool_use", id: "tu_1", name: "submit_brief", input: { ...validBrief, email: "x" } },
          ],
        };
      })
      .mockImplementationOnce(async ({ onText }) => {
        onText("Me falta un email válido.");
        return textReply("Me falta un email válido.");
      });
    const res = await POST(makeRequest({ messages: history(4) }));
    const texts = (await readEvents(res))
      .filter((e) => e.type === "text")
      .map((e) => e.text);
    expect(texts).toEqual(["Listo, ya tengo todo.", "\n\n", "Me falta un email válido."]);
  });

  it("in preview mode shows the brief to the client instead of emailing it", async () => {
    vi.stubEnv("CHAT_PREVIEW_BRIEF", "true");
    streamTurn
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockResolvedValueOnce(textReply("¡Gracias, Ana!"));
    const res = await POST(makeRequest({ messages: history(4) }));
    const events = await readEvents(res);

    expect(send).not.toHaveBeenCalled();
    const brief = events.find((e) => e.type === "brief");
    expect(brief.subject).toContain("Ana Pérez");
    expect(brief.text).toContain("Canal de contacto: chat con el agente");
    expect(events.at(-1)).toEqual({ type: "done", submitted: true });
  });

  it("ignores preview mode in production and emails the brief", async () => {
    vi.stubEnv("CHAT_PREVIEW_BRIEF", "true");
    vi.stubEnv("NODE_ENV", "production");
    streamTurn
      .mockResolvedValueOnce(toolReply(validBrief))
      .mockResolvedValueOnce(textReply("¡Gracias, Ana!"));
    const events = await readEvents(await POST(makeRequest({ messages: history(4) })));

    expect(send).toHaveBeenCalledTimes(1);
    expect(events.some((e) => e.type === "brief")).toBe(false);
  });

  it("does not emit a brief in preview mode when the brief is invalid", async () => {
    vi.stubEnv("CHAT_PREVIEW_BRIEF", "true");
    streamTurn
      .mockResolvedValueOnce(toolReply({ ...validBrief, email: undefined }))
      .mockResolvedValueOnce(textReply("¿Me pasás un email o teléfono?"));
    const events = await readEvents(await POST(makeRequest({ messages: history(4) })));

    expect(events.some((e) => e.type === "brief")).toBe(false);
    expect(events.at(-1)).toEqual({ type: "done", submitted: false });
  });
});
