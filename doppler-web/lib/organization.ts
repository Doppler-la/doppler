import { socialLinks } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const organizationId = `${siteUrl}/#organization`;

// Se publica solo en la home; las demás páginas lo referencian por @id.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": organizationId,
  name: "Doppler",
  description:
    "Desarrollo de software e IA para automatizaciones que generan resultados. Trabajamos con startups, pymes y empresas.",
  url: siteUrl,
  logo: `${siteUrl}/doppler-logo.png`,
  image: `${siteUrl}/og-image.png`,
  sameAs: socialLinks.map((link) => link.href),
  areaServed: "Latin America",
  knowsLanguage: "es",
};
