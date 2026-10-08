import { describe, it, expect } from "vitest";
import { buildSystemPrompt, WRAP_UP_MARKER } from "./prompt";
import { chatContent } from "@/lib/content";

describe("buildSystemPrompt", () => {
  it("tells the model about the greeting the client already saw", () => {
    expect(buildSystemPrompt({ wrapUp: false })).toContain(chatContent.greeting);
  });

  it("describes the skip option, the 2 to 5 follow-ups and the tool", () => {
    const prompt = buildSystemPrompt({ wrapUp: false });
    expect(prompt).toContain("entre 2 y 5 repreguntas");
    expect(prompt).toContain("omitirla");
    expect(prompt).toContain("submit_brief");
  });

  it("forbids solutions, prices and deadlines", () => {
    expect(buildSystemPrompt({ wrapUp: false })).toContain("NO proponés soluciones");
  });

  it("adds the wrap-up instruction only when asked", () => {
    expect(buildSystemPrompt({ wrapUp: false })).not.toContain(WRAP_UP_MARKER);
    expect(buildSystemPrompt({ wrapUp: true })).toContain(WRAP_UP_MARKER);
  });
});
