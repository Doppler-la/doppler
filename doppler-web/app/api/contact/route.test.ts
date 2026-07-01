import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns 200 and ok:true for a valid submission", async () => {
    const res = await POST(
      makeRequest({ name: "Ignacio", email: "ignacio@example.com", message: "Hola, quiero info" })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ email: "ignacio@example.com", message: "Hola" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(
      makeRequest({ name: "Ignacio", email: "not-an-email", message: "Hola" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is missing", async () => {
    const res = await POST(makeRequest({ name: "Ignacio", email: "ignacio@example.com" }));
    expect(res.status).toBe(400);
  });
});
