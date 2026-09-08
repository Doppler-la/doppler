import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  loadState,
  saveState,
  applyTelegramUpdates,
  publishableDrafts,
  recordPublished,
  recordRejected,
  isAlreadyPublished,
  prunePending,
  isTopicSeen,
} from "./state.mjs";

function fresh() {
  return {
    drafts: {
      last_telegram_update_id: 0,
      drafts: [
        { id: "d1", type: "a", topic: "Tema Uno", source_url: "https://x/1",
          thread: ["1/ a 🧵", "2/ b"], telegram_message_id: 10, status: "pending",
          created_at: new Date().toISOString() },
      ],
    },
    history: { published: [], rejected: [] },
  };
}

test("un draft aprobado por Telegram se puede publicar y luego pasa a history", () => {
  const s = fresh();
  const res = applyTelegramUpdates(s, [
    { update_id: 5, callback_query: { data: "approve:d1" } },
  ]);
  assert.deepEqual(res.approved, ["d1"]);
  assert.equal(s.drafts.last_telegram_update_id, 5);
  assert.equal(publishableDrafts(s).length, 1);

  recordPublished(s, "d1", "1830000000000000000");
  assert.equal(s.drafts.drafts.length, 0);
  assert.equal(s.history.published[0].x_post_id, "1830000000000000000");
  assert.equal(publishableDrafts(s).length, 0);
});

test("no se re-publica un id que ya está en history.published", () => {
  const s = fresh();
  s.drafts.drafts[0].status = "approved";
  recordPublished(s, "d1", "111");
  assert.equal(isAlreadyPublished(s, "d1"), true);
  assert.equal(publishableDrafts(s).length, 0);
});

test("un tema rechazado se detecta como visto (dedup en investigación)", () => {
  const s = fresh();
  applyTelegramUpdates(s, [{ update_id: 2, callback_query: { data: "reject:d1" } }]);
  recordRejected(s, "d1");
  assert.equal(s.drafts.drafts.length, 0);
  assert.equal(isTopicSeen(s, { source_url: "https://x/1", topic: "otro" }), true);
  assert.equal(isTopicSeen(s, { source_url: "https://x/otro", topic: "tema uno" }), true);
  assert.equal(isTopicSeen(s, { source_url: "https://x/otro", topic: "nuevo" }), false);
});

test("prunePending mueve a rejected los pending de más de 7 días", () => {
  const s = fresh();
  s.drafts.drafts[0].created_at = new Date(Date.now() - 8 * 864e5).toISOString();
  const pruned = prunePending(s);
  assert.deepEqual(pruned, ["d1"]);
  assert.equal(s.history.rejected.length, 1);
  assert.equal(s.drafts.drafts.length, 0);
});

test("prunePending barre a history los drafts rejected huérfanos", () => {
  const s = fresh();
  s.drafts.drafts[0].status = "rejected";
  const pruned = prunePending(s);
  assert.deepEqual(pruned, []);
  assert.equal(s.drafts.drafts.length, 0);
  assert.equal(s.history.rejected.length, 1);
});

test("saveState y loadState hacen round-trip", () => {
  const dir = pathToFileURL(mkdtempSync(join(tmpdir(), "agent-state-")) + "/");
  writeFileSync(new URL("drafts.json", dir), "{}");
  writeFileSync(new URL("history.json", dir), "{}");
  const s = fresh();
  saveState(s, dir);
  assert.deepEqual(loadState(dir), s);
});
