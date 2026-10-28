import { describe, it, expect } from "vitest";
import { servicePages, getServicePage } from "./servicePages";
import { services } from "./content";
import sitemap from "@/app/sitemap";

describe("servicePages", () => {
  it("has unique slugs and every home service card links to an existing page", () => {
    const slugs = servicePages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    services.forEach((service) => {
      const slug = service.href.replace("/servicios/", "");
      expect(getServicePage(slug), service.href).toBeDefined();
    });
  });

  it("keeps titles and descriptions within search result limits", () => {
    servicePages.forEach((page) => {
      expect(page.metaTitle.length, page.slug).toBeLessThanOrEqual(70);
      expect(page.metaDescription.length, page.slug).toBeLessThanOrEqual(160);
    });
  });

  it("lists every service page and the privacy page in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    servicePages.forEach((page) => expect(urls).toContain(`https://www.doppler.la/servicios/${page.slug}`));
    expect(urls).toContain("https://www.doppler.la/privacidad");
  });
});
