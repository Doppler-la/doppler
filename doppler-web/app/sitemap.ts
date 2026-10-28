import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// El sitio es una sola página: las secciones (#servicios, #ia, etc.) son anclas y no van en el sitemap.
// Al sumar páginas de servicios o casos de éxito, agregarlas acá.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: siteUrl } },
    },
  ];
}
