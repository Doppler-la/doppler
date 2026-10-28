import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { servicePages } from "@/lib/servicePages";

// Las secciones de la home (#servicios, #ia, etc.) son anclas y no van en el sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: siteUrl } },
    },
    ...servicePages.map((page) => ({
      url: `${siteUrl}/servicios/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/privacidad`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
