import { describe, it, expect } from "vitest";
import { parseHistory, countUserMessages } from "./history";

const u = (content: string) => ({ role: "user", content });
const a = (content: string) => ({ role: "assistant", content });

describe("parseHistory", () => {
  it("accepts an alternating history that ends with a user message", () => {
    const result = parseHistory({ messages: [u("hola"), a("¿qué necesitás?"), u("un sistema")] });
    expect(result).toEqual({
      ok: true,
      messages: [u("hola"), a("¿qué necesitás?"), u("un sistema")],
    });
  });

  it("trims message content", () => {
    const result = parseHistory({ messages: [u("  hola  ")] });
    expect(result).toEqual({ ok: true, messages: [u("hola")] });
  });

  it("rejects a missing or empty messages array", () => {
    expect(parseHistory({})).toEqual({ ok: false, error: "messages_required" });
    expect(parseHistory({ messages: [] })).toEqual({ ok: false, error: "messages_required" });
    expect(parseHistory(null)).toEqual({ ok: false, error: "messages_required" });
  });

  it("rejects roles other than user and assistant", () => {
    expect(parseHistory({ messages: [{ role: "system", content: "x" }] }).ok).toBe(false);
  });

  it("rejects non-string or empty content", () => {
    expect(parseHistory({ messages: [{ role: "user", content: 5 }] }).ok).toBe(false);
    expect(parseHistory({ messages: [u("   ")] }).ok).toBe(false);
  });

  it("rejects histories that do not alternate", () => {
    expect(parseHistory({ messages: [u("a"), u("b")] }).ok).toBe(false);
    expect(parseHistory({ messages: [a("a"), u("b")] }).ok).toBe(false);
  });

  it("rejects histories that end with an assistant message", () => {
    expect(parseHistory({ messages: [u("a"), a("b")] }).ok).toBe(false);
  });

  it("rejects a user message longer than 1500 characters", () => {
    const result = parseHistory({ messages: [u("x".repeat(1501))] });
    expect(result).toEqual({ ok: false, error: "message_too_long" });
  });

  it("rejects conversations with more than 12 user messages", () => {
    const messages: object[] = [];
    for (let i = 0; i < 13; i++) {
      messages.push(u(`m${i}`));
      if (i < 12) messages.push(a(`r${i}`));
    }
    expect(parseHistory({ messages })).toEqual({ ok: false, error: "conversation_too_long" });
  });
});

describe("countUserMessages", () => {
  it("counts only user messages", () => {
    expect(countUserMessages([u("a"), a("b"), u("c")] as never)).toBe(2);
  });
});
