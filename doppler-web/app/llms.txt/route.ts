import { siteUrl } from "@/lib/site";
import { servicePages } from "@/lib/servicePages";

// Resumen del sitio para asistentes de IA (formato llms.txt). Es opcional y Google Search lo ignora.
export function GET() {
  const services = servicePages.map((page) => `- [${page.name}](${siteUrl}/servicios/${page.slug}): ${page.metaDescription}`);
  const body = [
    "# Doppler",
    "",
    "> Software factory de LATAM. Desarrollo de software e IA para automatizaciones que generan resultados, para startups, pymes y empresas.",
    "",
    "## Servicios",
    "",
    ...services,
    "",
    "## Más información",
    "",
    `- [Inicio](${siteUrl}): servicios, clientes y contacto`,
    `- [Política de privacidad](${siteUrl}/privacidad)`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
