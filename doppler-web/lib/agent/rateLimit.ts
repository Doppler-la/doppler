import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Limiters = { hourly: Ratelimit; daily: Ratelimit; global: Ratelimit };

const DEFAULT_GLOBAL_DAILY_LIMIT = 500;

let limiters: Limiters | null | undefined;

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function globalDailyLimit(): number {
  const configured = Number.parseInt(process.env.CHAT_DAILY_LIMIT ?? "", 10);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_GLOBAL_DAILY_LIMIT;
}

function getLimiters(): Limiters | null {
  if (limiters !== undefined) return limiters;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (isProduction()) {
      console.warn("Upstash no está configurado: el chat queda bloqueado en producción.");
    }
    limiters = null;
    return limiters;
  }
  const redis = Redis.fromEnv();
  limiters = {
    hourly: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      prefix: "chat:hourly",
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 d"),
      prefix: "chat:daily",
    }),
    // Tope global: acota el gasto aunque el ataque venga de muchas IPs distintas.
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(globalDailyLimit(), "1 d"),
      prefix: "chat:global",
    }),
  };
  return limiters;
}

// Cierra en falla: sin Upstash o con Redis caído, en producción el chat se bloquea
// (el formulario de respaldo sigue funcionando) para que nadie pueda consumir tokens sin tope.
export async function allowRequest(ip: string): Promise<boolean> {
  const active = getLimiters();
  if (!active) return !isProduction();
  try {
    if (!(await active.hourly.limit(ip)).success) return false;
    if (!(await active.daily.limit(ip)).success) return false;
    return (await active.global.limit("global")).success;
  } catch (error) {
    console.error("Error en el rate limit del chat:", error);
    return !isProduction();
  }
}
