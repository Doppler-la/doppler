import { readFileSync, writeFileSync } from "node:fs";

const SEVEN_DAYS = 7 * 864e5;

export function loadState(dir = new URL("state/", import.meta.url)) {
  return {
    drafts: JSON.parse(readFileSync(new URL("drafts.json", dir), "utf8")),
    history: JSON.parse(readFileSync(new URL("history.json", dir), "utf8")),
  };
}

export function saveState(state, dir = new URL("state/", import.meta.url)) {
  writeFileSync(new URL("drafts.json", dir), JSON.stringify(state.drafts, null, 2) + "\n");
  writeFileSync(new URL("history.json", dir), JSON.stringify(state.history, null, 2) + "\n");
}

export function applyTelegramUpdates(state, updates) {
  const approved = [], rejected = [];
  for (const u of updates) {
    if (u.update_id > state.drafts.last_telegram_update_id) {
      state.drafts.last_telegram_update_id = u.update_id;
    }
    const data = u.callback_query?.data;
    if (!data) continue;
    const [action, id] = data.split(":");
    const draft = state.drafts.drafts.find((d) => d.id === id);
    if (!draft) continue;
    if (action === "approve") { draft.status = "approved"; approved.push(id); }
    if (action === "reject") { draft.status = "rejected"; rejected.push(id); }
  }
  return { approved, rejected };
}

export function isAlreadyPublished(state, draftId) {
  return state.history.published.some((p) => p.id === draftId);
}

export function publishableDrafts(state) {
  return state.drafts.drafts.filter(
    (d) => d.status === "approved" && !isAlreadyPublished(state, d.id),
  );
}

function removeDraft(state, draftId) {
  const i = state.drafts.drafts.findIndex((d) => d.id === draftId);
  return i === -1 ? null : state.drafts.drafts.splice(i, 1)[0];
}

export function recordPublished(state, draftId, xPostId) {
  const d = removeDraft(state, draftId);
  if (!d) return;
  state.history.published.push({
    id: d.id, topic: d.topic, source_url: d.source_url ?? null,
    x_post_id: xPostId, published_at: new Date().toISOString(),
  });
}

export function recordRejected(state, draftId) {
  const d = removeDraft(state, draftId);
  if (!d) return;
  state.history.rejected.push({
    id: d.id, topic: d.topic, source_url: d.source_url ?? null,
    rejected_at: new Date().toISOString(),
  });
}

export function prunePending(state, now = new Date()) {
  const pruned = [];
  for (const d of [...state.drafts.drafts]) {
    if (d.status === "rejected") {
      recordRejected(state, d.id); // barre huérfanos que nunca pasaron a history
      continue;
    }
    if (d.status === "pending" && now - new Date(d.created_at) > SEVEN_DAYS) {
      recordRejected(state, d.id);
      pruned.push(d.id);
    }
  }
  return pruned;
}

export function isTopicSeen(state, { source_url, topic }) {
  const all = [...state.history.published, ...state.history.rejected];
  const t = topic?.toLowerCase();
  return all.some(
    (x) => (source_url && x.source_url === source_url) ||
           (t && x.topic?.toLowerCase() === t),
  );
}
