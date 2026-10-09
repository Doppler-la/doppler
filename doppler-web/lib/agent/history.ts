import { MAX_MESSAGE_CHARS, MAX_USER_MESSAGES } from "./limits";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type HistoryResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

const MAX_ASSISTANT_CHARS = 6000;

function fail(error: string): HistoryResult {
  return { ok: false, error };
}

export function countUserMessages(messages: ChatMessage[]): number {
  return messages.filter((m) => m.role === "user").length;
}

export function parseHistory(body: unknown): HistoryResult {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return fail("messages_required");
  if (raw.length > MAX_USER_MESSAGES * 2) return fail("conversation_too_long");

  const messages: ChatMessage[] = [];
  for (const [index, item] of raw.entries()) {
    if (typeof item !== "object" || item === null) return fail("invalid_message");
    const { role, content } = item as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return fail("invalid_message");
    }
    if (role !== (index % 2 === 0 ? "user" : "assistant")) return fail("invalid_order");
    const text = content.trim();
    if (!text) return fail("empty_message");
    const cap = role === "user" ? MAX_MESSAGE_CHARS : MAX_ASSISTANT_CHARS;
    if (text.length > cap) return fail("message_too_long");
    messages.push({ role, content: text });
  }

  if (messages[messages.length - 1].role !== "user") return fail("invalid_order");
  if (countUserMessages(messages) > MAX_USER_MESSAGES) return fail("conversation_too_long");
  return { ok: true, messages };
}
