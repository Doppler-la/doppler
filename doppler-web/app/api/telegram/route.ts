import { Redis } from "@upstash/redis";

// Webhook del bot de Telegram: confirma al instante los clicks de Aprobar/Rechazar
// y deja el update en una cola de Redis que la rutina diaria (agent/playbook.md, paso 2) drena.
const QUEUE_KEY = "telegram:updates";

const API = "https://api.telegram.org";

type Update = {
  callback_query?: {
    id: string;
    data?: string;
    message?: { message_id: number; chat: { id: number } };
  };
  message?: { chat: { id: number } };
};

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error(`Telegram ${method} falló:`, res.status, await res.text());
}

function getRedis(): Redis {
  // La integración de Vercel inyecta KV_REST_API_*; mismo fallback que rateLimit.ts.
  return new Redis({
    url: (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)!,
    token: (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)!,
  });
}

export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return new Response("forbidden", { status: 403 });
  }

  const update = (await req.json()) as Update;
  const cq = update.callback_query;
  const chat = cq?.message?.chat.id ?? update.message?.chat.id;
  // Solo el chat del dueño: cualquier otro se ignora (igual que applyTelegramUpdates).
  if (!process.env.TELEGRAM_CHAT_ID || String(chat) !== process.env.TELEGRAM_CHAT_ID) {
    return Response.json({ ok: true });
  }

  // Primero encolar: si Redis falla devolvemos 500 y Telegram reintenta el update.
  try {
    await getRedis().rpush(QUEUE_KEY, JSON.stringify(update));
  } catch (error) {
    console.error("No se pudo encolar el update de Telegram:", error);
    if (cq) await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "⚠️ No se pudo guardar, probá de nuevo", show_alert: true });
    return new Response("queue error", { status: 500 });
  }

  const [action, id] = cq?.data?.split(":") ?? [];
  if (cq && (action === "approve" || action === "reject")) {
    const ok = action === "approve";
    await tg("answerCallbackQuery", {
      callback_query_id: cq.id,
      text: ok ? "✅ Aprobado" : "❌ Rechazado",
    });
    await tg("editMessageText", {
      chat_id: chat,
      message_id: cq.message!.message_id,
      text: ok
        ? `✅ Aprobado (${id}). Se publica en la próxima corrida, 9:05 ART.`
        : `❌ Rechazado (${id}).`,
      reply_markup: { inline_keyboard: [] },
    });
  } else if (cq) {
    await tg("answerCallbackQuery", { callback_query_id: cq.id });
  }
  return Response.json({ ok: true });
}
