import { describe, it, expect } from "vitest";
import {
  navLinks,
  heroContent,
  clientLogos,
  services,
  aiSection,
  metrics,
  testimonials,
  faqItems,
  footerLinks,
} from "./content";

describe("content", () => {
  it("has 4 nav links", () => {
    expect(navLinks).toHaveLength(4);
  });

  it("has hero headline and CTA", () => {
    expect(heroContent.headline).toContain("Startups, Pymes y Empresas");
    expect(heroContent.ctaLabel).toBe("Hablemos hoy");
  });

  it("has at least 1 client logo, each with a name and image source", () => {
    expect(clientLogos.length).toBeGreaterThanOrEqual(1);
    clientLogos.forEach((logo) => {
      expect(logo.name).toBeTruthy();
      expect(logo.src).toBeTruthy();
    });
  });

  it("has exactly 3 services", () => {
    expect(services).toHaveLength(3);
  });

  it("has 4 AI capabilities and a 4-step methodology", () => {
    expect(aiSection.capabilities).toHaveLength(4);
    expect(aiSection.methodology).toHaveLength(4);
  });

  it("has 3 metrics", () => {
    expect(metrics).toHaveLength(3);
  });

  it("has between 3 and 4 testimonials", () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
    expect(testimonials.length).toBeLessThanOrEqual(4);
  });

  it("has 5 FAQ items", () => {
    expect(faqItems).toHaveLength(5);
  });

  it("has footer links", () => {
    expect(footerLinks.length).toBeGreaterThan(0);
  });
});
