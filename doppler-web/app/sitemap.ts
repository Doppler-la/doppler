import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { servicePages } from "@/lib/servicePages";

// lastModified es la fecha real de la última edición del contenido, no la del build:
// Google ignora lastmod si cambia siempre. Actualizarlas al editar cada página.
const homeUpdatedAt = "2026-10-29";
const privacyUpdatedAt = "2026-10-28";

// Las secciones de la home (#servicios, #ia, etc.) son anclas y no van en el sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: homeUpdatedAt,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: siteUrl } },
    },
    ...servicePages.map((page) => ({
      url: `${siteUrl}/servicios/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/privacidad`, lastModified: privacyUpdatedAt, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
