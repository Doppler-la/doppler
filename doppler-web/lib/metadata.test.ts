import { describe, it, expect } from "vitest";
import { socialMetadata } from "./metadata";
import { generateMetadata } from "@/app/(pages)/servicios/[slug]/page";
import { metadata as privacy } from "@/app/(pages)/privacidad/page";
import { servicePages } from "./servicePages";

describe("social metadata", () => {
  it("includes image, locale, site name and a large Twitter card", () => {
    const meta = socialMetadata({ title: "T", description: "D", path: "/x" });
    expect(meta.openGraph).toMatchObject({ siteName: "Doppler", locale: "es_AR", url: "/x", title: "T" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", site: "@dopplerla", images: ["/og-image.png"] });
  });

  it.each(servicePages)("keeps the share image on the $slug page", (page) => {
    const meta = generateMetadata({ params: { slug: page.slug } });
    expect(meta.openGraph).toMatchObject({ title: page.metaTitle });
    expect((meta.openGraph as { images: unknown[] }).images).toHaveLength(1);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("gives the privacy page its own og:title", () => {
    expect(privacy.openGraph).toMatchObject({ title: "Política de privacidad | Doppler" });
    expect(privacy.twitter).toMatchObject({ title: "Política de privacidad | Doppler" });
  });
});
