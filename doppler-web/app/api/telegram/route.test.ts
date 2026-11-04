import { describe, it, expect, vi, beforeEach } from "vitest";

const rpush = vi.fn();
vi.mock("@upstash/redis", () => ({
  Redis: class {
    rpush = rpush;
  },
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const { POST } = await import("./route");

const click = (data: string, chat = 111) => ({
  update_id: 1,
  callback_query: { id: "cb1", data, message: { message_id: 7, chat: { id: chat } } },
});

function call(body: unknown, secret = "s3cret") {
  return POST(
    new Request("http://x/api/telegram", {
      method: "POST",
      headers: { "x-telegram-bot-api-secret-token": secret },
      body: JSON.stringify(body),
    }),
  );
}

const methods = () => fetchMock.mock.calls.map((c) => String(c[0]).split("/").pop());

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock.mockResolvedValue(new Response("{}"));
  rpush.mockResolvedValue(1);
  process.env.TELEGRAM_WEBHOOK_SECRET = "s3cret";
  process.env.TELEGRAM_CHAT_ID = "111";
  process.env.TELEGRAM_BOT_TOKEN = "tok";
  process.env.UPSTASH_REDIS_REST_URL = "https://r";
  process.env.UPSTASH_REDIS_REST_TOKEN = "t";
});

describe("POST /api/telegram", () => {
  it("rechaza si el secret no coincide", async () => {
    expect((await call(click("approve:a"), "mal")).status).toBe(403);
    expect(rpush).not.toHaveBeenCalled();
  });

  it("ignora otros chats", async () => {
    expect((await call(click("approve:a", 999))).status).toBe(200);
    expect(rpush).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("aprobar: encola, responde el callback y edita el mensaje", async () => {
    const res = await call(click("approve:2026-11-04-x"));
    expect(res.status).toBe(200);
    expect(rpush).toHaveBeenCalledWith("telegram:updates", expect.stringContaining("approve:2026-11-04-x"));
    expect(methods()).toEqual(["answerCallbackQuery", "editMessageText"]);
    const edit = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(edit.text).toContain("Aprobado");
    expect(edit.reply_markup).toEqual({ inline_keyboard: [] });
  });

  it("un mensaje de texto (link para el inbox) solo se encola", async () => {
    await call({ update_id: 2, message: { chat: { id: 111 }, text: "https://x.com/a/status/1" } });
    expect(rpush).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("si Redis falla devuelve 500 (Telegram reintenta) y avisa en el botón", async () => {
    rpush.mockRejectedValue(new Error("down"));
    expect((await call(click("approve:a"))).status).toBe(500);
    expect(methods()).toEqual(["answerCallbackQuery"]);
  });
});
