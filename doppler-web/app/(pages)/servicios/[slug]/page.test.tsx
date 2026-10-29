import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicePage, { generateMetadata, generateStaticParams } from "./page";
import { servicePages } from "@/lib/servicePages";
import { testimonials } from "@/lib/content";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("ServicePage", () => {
  it("generates a static page per service", () => {
    expect(generateStaticParams()).toEqual(servicePages.map((page) => ({ slug: page.slug })));
  });

  it.each(servicePages)("renders $slug with one H1, a contact anchor and Service JSON-LD", (page) => {
    const { container } = render(<ServicePage params={{ slug: page.slug }} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(page.headline);
    expect(container.querySelector("#contacto")).not.toBeNull();
    const ld = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld[0]["@type"]).toBe("Service");
    expect(ld[0].url).toBe(`https://www.doppler.la/servicios/${page.slug}`);
  });

  it("sets a canonical URL in the metadata", () => {
    const meta = generateMetadata({ params: { slug: "consultoria-tech" } });
    expect(meta.alternates?.canonical).toBe("/servicios/consultoria-tech");
  });

  it("returns not found for an unknown slug", () => {
    expect(() => render(<ServicePage params={{ slug: "nope" }} />)).toThrow("NEXT_NOT_FOUND");
  });

  it.each(servicePages)("keeps enough visible content to work as a paid landing: $slug", (page) => {
    const { container } = render(<ServicePage params={{ slug: page.slug }} />);
    container.querySelectorAll("script").forEach((node) => node.remove());
    const words = (container.textContent ?? "").split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(350);
  });

  it.each(servicePages)("only quotes testimonials that already exist on the site: $slug", (page) => {
    const { container } = render(<ServicePage params={{ slug: page.slug }} />);
    page.testimonialCompanies.forEach((company) => {
      expect(testimonials.some((t) => t.company === company), company).toBe(true);
    });
    testimonials
      .filter((t) => page.testimonialCompanies.includes(t.company))
      .forEach((t) => expect(container.textContent).toContain(t.quote));
  });
});
