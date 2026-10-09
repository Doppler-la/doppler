import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(rel);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name) ? [rel] : [];
  });
}

const files = ["app", "components", "lib"].flatMap(sourceFiles);
const clientFiles = files.filter((f) =>
  /^\s*["']use client["']/.test(fs.readFileSync(path.join(root, f), "utf8"))
);

describe("secrets never reach the browser", () => {
  it("finds the client components it is supposed to guard", () => {
    expect(clientFiles.length).toBeGreaterThan(0);
  });

  it.each(clientFiles)("%s does not read env vars or import server-only modules", (file) => {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    expect(source).not.toMatch(/process\.env/);
    expect(source).not.toMatch(
      /from\s+["'](resend|@anthropic-ai\/sdk|@upstash\/[^"']+|@\/lib\/agent\/(claude|rateLimit)|@\/lib\/recipients)["']/
    );
  });

  it("does not expose any variable through NEXT_PUBLIC_ or next.config env", () => {
    const sources = [...files, "next.config.mjs", ".env.local.example", "package.json"];
    for (const file of sources) {
      const source = fs.readFileSync(path.join(root, file), "utf8");
      expect(source, file).not.toMatch(/NEXT_PUBLIC_/);
    }
    expect(fs.readFileSync(path.join(root, "next.config.mjs"), "utf8")).not.toMatch(/\benv\s*:/);
  });
});
