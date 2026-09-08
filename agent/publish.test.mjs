import { test } from "node:test";
import assert from "node:assert/strict";
import { formatThread, validateThread, postThread } from "./publish.mjs";

test("formatThread numera los tweets", () => {
  assert.equal(formatThread(["hola", "chau"]), "1/ hola\n\n2/ chau");
});

test("validateThread rechaza tweets vacíos, largos y conteos fuera de rango", () => {
  assert.deepEqual(validateThread(["a", "b"]), []);
  assert.ok(validateThread(["solo uno"]).length > 0);
  assert.ok(validateThread(["a", "  "]).some((e) => /vac/i.test(e)));
  assert.ok(validateThread(["a", "x".repeat(281)]).some((e) => /280/.test(e)));
  assert.ok(validateThread(new Array(7).fill("a")).length > 0);
  assert.ok(validateThread({}).some((e) => /entre 2 y 6/.test(e)));
});

test("postThread captura el primer id si falla a mitad del hilo", async () => {
  let n = 0;
  const post = async () => {
    n += 1;
    if (n === 3) throw new Error("boom");
    return { data: { id: `id${n}` } };
  };
  await assert.rejects(
    () => postThread(["a", "b", "c", "d"], post),
    (e) => e.message === "boom" && e.firstId === "id1" && e.posted === 2,
  );
});
