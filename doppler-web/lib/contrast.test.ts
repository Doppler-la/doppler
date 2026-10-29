import { describe, it, expect } from "vitest";
import config from "../tailwind.config";

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const colors = (config.theme!.extend as { colors: Record<string, string> }).colors;

describe("text colors on dark backgrounds", () => {
  it.each(["background", "surface"])("accent-soft meets WCAG AA (4.5:1) on %s", (bg) => {
    expect(contrast(colors["accent-soft"], colors[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it("documents why the plain accent is not used for small text", () => {
    expect(contrast(colors.accent, colors.background)).toBeLessThan(4.5);
  });
});
