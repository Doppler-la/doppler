import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { servicePages } from "./servicePages";
import { organizationJsonLd, organizationId } from "./organization";
import nextConfig from "../next.config.mjs";

describe("sitemap lastmod", () => {
  it("uses fixed content dates, not the build time", () => {
    const first = sitemap().map((entry) => entry.lastModified);
    const second = sitemap().map((entry) => entry.lastModified);
    expect(first).toEqual(second);
    first.forEach((date) => expect(String(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/));
  });

  it("takes each service page date from its own content", () => {
    servicePages.forEach((page) => {
      const entry = sitemap().find((e) => e.url.endsWith(`/servicios/${page.slug}`));
      expect(entry?.lastModified).toBe(page.updatedAt);
    });
  });
});

describe("organization JSON-LD", () => {
  it("has a stable @id that service pages can reference", () => {
    expect(organizationJsonLd["@id"]).toBe(organizationId);
    expect(organizationJsonLd["@type"]).toBe("ProfessionalService");
  });
});

describe("security headers", () => {
  it("sets a CSP without weakening script execution", async () => {
    const headers = await nextConfig.headers!();
    const csp = headers[0].headers.find((h: { key: string }) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("frame-ancestors 'none'");
    expect(csp?.value).toContain("object-src 'none'");
    expect(csp?.value).not.toContain("unsafe-");
  });
});
