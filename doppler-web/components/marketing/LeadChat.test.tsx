import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeadChat from "./LeadChat";
import { chatContent } from "@/lib/content";

afterEach(() => {
  vi.unstubAllGlobals();
});

function ndjson(events: object[]) {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      controller.close();
    },
  });
}

function stubChat(events: object[]) {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, body: ndjson(events) });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function send(text: string) {
  fireEvent.change(screen.getByLabelText(chatContent.inputLabel), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: chatContent.sendLabel }));
}

describe("LeadChat", () => {
  it("shows the heading, the greeting and the fallback summary", () => {
    render(<LeadChat />);
    expect(screen.getByText(chatContent.heading)).toBeInTheDocument();
    expect(screen.getByText(chatContent.greeting)).toBeInTheDocument();
    expect(screen.getByText(chatContent.fallbackSummary)).toBeInTheDocument();
  });

  it("sends the user message and shows the streamed reply", async () => {
    const fetchMock = stubChat([
      { type: "text", text: "¿Cómo lo hacen " },
      { type: "text", text: "hoy?" },
      { type: "done", submitted: false },
    ]);
    render(<LeadChat />);

    send("Cargo pedidos a mano");

    await waitFor(() => expect(screen.getByText("¿Cómo lo hacen hoy?")).toBeInTheDocument());
    expect(screen.getByText("Cargo pedidos a mano")).toBeInTheDocument();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages).toEqual([{ role: "user", content: "Cargo pedidos a mano" }]);
    expect(screen.getByLabelText(chatContent.inputLabel)).toHaveValue("");
  });

  it("sends the previous turns on the next message", async () => {
    const fetchMock = stubChat([
      { type: "text", text: "¿Qué herramientas usan?" },
      { type: "done", submitted: false },
    ]);
    render(<LeadChat />);
    send("Cargo pedidos a mano");
    await waitFor(() => expect(screen.getByText("¿Qué herramientas usan?")).toBeInTheDocument());

    fetchMock.mockResolvedValue({
      ok: true,
      body: ndjson([{ type: "text", text: "Gracias" }, { type: "done", submitted: false }]),
    });
    send("Excel");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const body = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body.messages).toEqual([
      { role: "user", content: "Cargo pedidos a mano" },
      { role: "assistant", content: "¿Qué herramientas usan?" },
      { role: "user", content: "Excel" },
    ]);
  });

  it("closes the conversation after the brief is submitted", async () => {
    stubChat([
      { type: "text", text: "¡Gracias, Ana!" },
      { type: "done", submitted: true },
    ]);
    render(<LeadChat />);
    send("Mi mail es ana@empresa.com");

    await waitFor(() => expect(screen.getByText(chatContent.closedNotice)).toBeInTheDocument());
    expect(screen.getByLabelText(chatContent.inputLabel)).toBeDisabled();
  });

  it("shows an error, restores the text and opens the fallback when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    render(<LeadChat />);
    send("Hola");

    await waitFor(() => expect(screen.getByText(chatContent.errorMessage)).toBeInTheDocument());
    expect(screen.getByLabelText(chatContent.inputLabel)).toHaveValue("Hola");
    expect(screen.getByText(chatContent.fallbackSummary).closest("details")).toHaveAttribute("open");
  });

  it("treats an error event from the stream as a failure", async () => {
    stubChat([{ type: "error", message: "agent_unavailable" }]);
    render(<LeadChat />);
    send("Hola");

    await waitFor(() => expect(screen.getByText(chatContent.errorMessage)).toBeInTheDocument());
  });

  it("shows the brief preview panel when the server sends a brief event", async () => {
    stubChat([
      { type: "text", text: "¡Gracias, Ana!" },
      { type: "brief", subject: "Nuevo brief de descubrimiento: Ana", text: "Canal de contacto: chat con el agente" },
      { type: "done", submitted: true },
    ]);
    render(<LeadChat />);
    send("Mi mail es ana@empresa.com");

    await waitFor(() => expect(screen.getByText(chatContent.previewTitle)).toBeInTheDocument());
    expect(screen.getByText(/Nuevo brief de descubrimiento: Ana/)).toBeInTheDocument();
    expect(screen.getByText(/Canal de contacto: chat con el agente/)).toBeInTheDocument();
  });

  it("does not show the preview panel when there is no brief event", () => {
    render(<LeadChat />);
    expect(screen.queryByText(chatContent.previewTitle)).not.toBeInTheDocument();
  });
});
