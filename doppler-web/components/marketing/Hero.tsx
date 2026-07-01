import Link from "next/link";
import { heroContent } from "@/lib/content";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/30 via-background to-background px-6 py-28 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-accent">
          {heroContent.eyebrow}
        </span>
        <h1 className="mt-4 text-4xl font-bold text-foreground md:text-6xl">
          {heroContent.headline}
        </h1>
        <p className="mt-6 text-lg text-muted">{heroContent.subheadline}</p>
        <Link
          href={heroContent.ctaHref}
          className="mt-10 inline-block rounded-md bg-accent px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent/80"
        >
          {heroContent.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
