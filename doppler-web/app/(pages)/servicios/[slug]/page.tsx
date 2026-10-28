import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aiSection } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { getServicePage, servicePages } from "@/lib/servicePages";
import LeadChat from "@/components/marketing/LeadChat";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getServicePage(params.slug);
  if (!page) return {};
  const path = `/servicios/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: path, type: "website" },
    twitter: { title: page.metaTitle, description: page.metaDescription },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const page = getServicePage(params.slug);
  if (!page) notFound();

  const url = `${siteUrl}/servicios/${page.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.name,
      description: page.metaDescription,
      url,
      serviceType: page.name,
      areaServed: "Latin America",
      provider: { "@type": "ProfessionalService", name: "Doppler", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
        { "@type": "ListItem", position: 2, name: page.name, item: url },
      ],
    },
  ];
  const others = servicePages.filter((other) => other.slug !== page.slug);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="px-6 pb-16 pt-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>{" "}
            / <span className="text-foreground">{page.name}</span>
          </nav>
          <h1 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">{page.headline}</h1>
          <p className="mt-6 text-lg text-muted">{page.intro}</p>
          <Link
            href="#contacto"
            className="bg-brand-gradient mt-8 inline-block rounded-lg px-8 py-3 text-base font-semibold text-foreground shadow-lg shadow-accent/40 transition-opacity hover:opacity-90"
          >
            Contanos tu proyecto
          </Link>
        </div>
      </section>

      <section className="bg-surface px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Qué incluye</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {page.includes.map((item) => (
              <div key={item.title} className="rounded-lg border border-primary/40 bg-background p-6">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Para quién es</h2>
          <ul className="mt-6 list-disc space-y-3 pl-6 text-muted">
            {page.forWho.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {page.slug === "ia-y-automatizaciones" && (
        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Cómo trabajamos</h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {aiSection.methodology.map((step) => (
                <li key={step.step} className="rounded-lg border border-primary/40 bg-background p-6">
                  <span className="text-sm font-semibold text-accent">Paso {step.step}</span>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Preguntas frecuentes</h2>
          <dl className="mt-8 space-y-6">
            {page.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-surface px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-foreground">Otros servicios</h2>
          <ul className="mt-4 flex flex-wrap gap-4">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/servicios/${other.slug}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LeadChat />
    </main>
  );
}
