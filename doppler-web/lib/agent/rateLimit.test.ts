import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("allowRequest", () => {
  it("allows every request when Upstash is not configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const { allowRequest } = await import("./rateLimit");
    expect(await allowRequest("1.2.3.4", true)).toBe(true);
    expect(await allowRequest("1.2.3.4", false)).toBe(true);
  });
});
