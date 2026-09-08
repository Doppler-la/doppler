import { TwitterApi } from "twitter-api-v2";
import { loadState, saveState, isAlreadyPublished, recordPublished } from "./state.mjs";

export function formatThread(thread) {
  return thread.map((t, i) => `${i + 1}/ ${t}`).join("\n\n");
}

export function validateThread(thread) {
  const errors = [];
  if (!Array.isArray(thread) || thread.length < 2 || thread.length > 6) {
    errors.push("el hilo debe tener entre 2 y 6 tweets");
  }
  if (Array.isArray(thread)) {
    thread.forEach((t, i) => {
      if (!t || !t.trim()) errors.push(`tweet ${i + 1} vacío`);
      else if (t.length > 280) errors.push(`tweet ${i + 1} supera 280 caracteres (${t.length})`);
    });
  }
  return errors;
}

function client() {
  return new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });
}

export async function postThread(
  thread,
  post = (text, opts) => client().readWrite.v2.tweet(text, opts),
) {
  let replyTo = null;
  let firstId = null;
  let posted = 0;
  try {
    for (const text of thread) {
      const opts = replyTo ? { reply: { in_reply_to_tweet_id: replyTo } } : {};
      const { data } = await post(text, opts);
      replyTo = data.id;
      firstId ??= data.id;
      posted += 1;
    }
  } catch (e) {
    e.firstId = firstId; // puede ser null si falló el primer tweet
    e.posted = posted;
    throw e;
  }
  return firstId;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const draftId = args.filter((a) => a !== "--dry-run")[0];
  if (!draftId) { console.error("uso: node publish.mjs [--dry-run] <draftId>"); process.exit(1); }

  const state = loadState();
  const draft = state.drafts.drafts.find((d) => d.id === draftId);
  if (!draft) { console.error(`draft ${draftId} no encontrado`); process.exit(1); }

  const errors = validateThread(draft.thread);
  if (errors.length) { errors.forEach((e) => console.error("✗", e)); process.exit(1); }

  if (dryRun) { console.log(formatThread(draft.thread)); return; }

  if (draft.status !== "approved") { console.error(`⚠️ ${draftId} no está aprobado`); process.exit(1); }

  if (isAlreadyPublished(state, draftId)) { console.log("already published"); return; }

  let firstId;
  try {
    firstId = await postThread(draft.thread);
  } catch (e) {
    if (e.firstId) {
      recordPublished(state, draftId, e.firstId);
      saveState(state);
      console.error(
        `⚠️ parcial: se publicaron ${e.posted}/${draft.thread.length} tweets del hilo ${e.firstId}, completá los que faltan a mano`,
      );
      process.exit(1);
    }
    throw e;
  }
  recordPublished(state, draftId, firstId);
  saveState(state);
  console.log(firstId);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
}
