import { test } from "node:test";
import assert from "node:assert/strict";
import { formatThread, validateThread } from "./publish.mjs";

test("formatThread numera los tweets", () => {
  assert.equal(formatThread(["hola", "chau"]), "1/ hola\n\n2/ chau");
});

test("validateThread rechaza tweets vacíos, largos y conteos fuera de rango", () => {
  assert.deepEqual(validateThread(["a", "b"]), []);
  assert.ok(validateThread(["solo uno"]).length > 0);
  assert.ok(validateThread(["a", "  "]).some((e) => /vac/i.test(e)));
  assert.ok(validateThread(["a", "x".repeat(281)]).some((e) => /280/.test(e)));
  assert.ok(validateThread(new Array(7).fill("a")).length > 0);
});
