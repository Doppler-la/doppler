import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Limiters = { conversations: Ratelimit; messages: Ratelimit };

let limiters: Limiters | null | undefined;

function getLimiters(): Limiters | null {
  if (limiters !== undefined) return limiters;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Upstash no está configurado: el chat funciona sin rate limit.");
    }
    limiters = null;
    return limiters;
  }
  const redis = Redis.fromEnv();
  limiters = {
    conversations: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "chat:conversations",
    }),
    messages: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      prefix: "chat:messages",
    }),
  };
  return limiters;
}

// Si Redis falla se deja pasar: preferimos no perder un lead a bloquear el chat.
export async function allowRequest(ip: string, isNewConversation: boolean): Promise<boolean> {
  const active = getLimiters();
  if (!active) return true;
  try {
    const messages = await active.messages.limit(ip);
    if (!messages.success) return false;
    if (isNewConversation) {
      const conversations = await active.conversations.limit(ip);
      if (!conversations.success) return false;
    }
    return true;
  } catch (error) {
    console.error("Error en el rate limit del chat:", error);
    return true;
  }
}
