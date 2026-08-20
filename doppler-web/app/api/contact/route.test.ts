import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.fn().mockResolvedValue({ data: { id: "test" }, error: null });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { POST } = await import("./route");

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    send.mockClear();
  });

  it("returns 200 and ok:true for a valid submission", async () => {
    const res = await POST(
      makeRequest({ name: "Ignacio", email: "ignacio@example.com", message: "Hola, quiero info" })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["dsalamone@doppler.la", "i.irigoitia@doppler.la"],
        replyTo: "ignacio@example.com",
      })
    );
  });

  it("returns 502 when the email fails to send", async () => {
    send.mockResolvedValueOnce({ data: null, error: { message: "fail" } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(
      makeRequest({ name: "Ignacio", email: "ignacio@example.com", message: "Hola" })
    );
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.ok).toBe(false);
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
