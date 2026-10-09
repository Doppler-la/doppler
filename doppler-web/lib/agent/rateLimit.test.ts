import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const limits = vi.hoisted(() => ({
  "chat:hourly": vi.fn(),
  "chat:daily": vi.fn(),
  "chat:global": vi.fn(),
}));
const slidingWindow = vi.hoisted(() => vi.fn((n: number, w: string) => `${n}/${w}`));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = slidingWindow;
    prefix: keyof typeof limits;
    constructor(options: { prefix: keyof typeof limits }) {
      this.prefix = options.prefix;
    }
    limit(key: string) {
      return limits[this.prefix](key);
    }
  },
}));
vi.mock("@upstash/redis", () => ({ Redis: { fromEnv: () => ({}) } }));

const ok = { success: true };
const blocked = { success: false };

async function load() {
  vi.resetModules();
  return (await import("./rateLimit")).allowRequest;
}

function configureUpstash() {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
}

beforeEach(() => {
  slidingWindow.mockClear();
  for (const fn of Object.values(limits)) fn.mockReset().mockResolvedValue(ok);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("allowRequest without Upstash", () => {
  it("allows requests outside production", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const allowRequest = await load();
    expect(await allowRequest("1.2.3.4")).toBe(true);
  });

  it("blocks requests in production so the chat cannot run without a limit", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const allowRequest = await load();
    expect(await allowRequest("1.2.3.4")).toBe(false);
  });
});

describe("allowRequest with Upstash", () => {
  it("allows a request that is under every limit, keyed by IP and by a global key", async () => {
    configureUpstash();
    const allowRequest = await load();
    expect(await allowRequest("1.2.3.4")).toBe(true);
    expect(limits["chat:hourly"]).toHaveBeenCalledWith("1.2.3.4");
    expect(limits["chat:daily"]).toHaveBeenCalledWith("1.2.3.4");
    expect(limits["chat:global"]).toHaveBeenCalledWith("global");
  });

  it("blocks when the hourly limit is exceeded and does not spend the other budgets", async () => {
    configureUpstash();
    limits["chat:hourly"].mockResolvedValue(blocked);
    const allowRequest = await load();
    expect(await allowRequest("1.2.3.4")).toBe(false);
    expect(limits["chat:daily"]).not.toHaveBeenCalled();
    expect(limits["chat:global"]).not.toHaveBeenCalled();
  });

  it("blocks when the daily per-IP limit is exceeded", async () => {
    configureUpstash();
    limits["chat:daily"].mockResolvedValue(blocked);
    const allowRequest = await load();
    expect(await allowRequest("1.2.3.4")).toBe(false);
  });

  it("blocks when the global daily limit is exceeded", async () => {
    configureUpstash();
    limits["chat:global"].mockResolvedValue(blocked);
    const allowRequest = await load();
    expect(await allowRequest("1.2.3.4")).toBe(false);
  });

  it("uses CHAT_DAILY_LIMIT for the global window and 500 by default", async () => {
    configureUpstash();
    await (await load())("1.2.3.4");
    expect(slidingWindow).toHaveBeenCalledWith(500, "1 d");

    slidingWindow.mockClear();
    vi.stubEnv("CHAT_DAILY_LIMIT", "123");
    await (await load())("1.2.3.4");
    expect(slidingWindow).toHaveBeenCalledWith(123, "1 d");
  });

  it("blocks in production when Redis fails, but not outside production", async () => {
    configureUpstash();
    limits["chat:hourly"].mockRejectedValue(new Error("redis down"));
    vi.stubEnv("NODE_ENV", "production");
    expect(await (await load())("1.2.3.4")).toBe(false);

    vi.stubEnv("NODE_ENV", "test");
    expect(await (await load())("1.2.3.4")).toBe(true);
  });
});
