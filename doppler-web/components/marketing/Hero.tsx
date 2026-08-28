import Link from "next/link";
import { heroContent } from "@/lib/content";
import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-28 text-center">
      <HeroBackground />
      <div className="relative z-10 mx-auto max-w-3xl">
        <span className="text-gradient text-sm font-semibold uppercase tracking-widest">
          {heroContent.eyebrow}
        </span>
        <h1 className="mt-4 text-4xl font-bold text-foreground md:text-6xl">
          {heroContent.headline}
        </h1>
        <p className="mt-6 text-lg text-muted">{heroContent.subheadline}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={heroContent.ctaHref}
            className="bg-brand-gradient inline-block rounded-lg px-8 py-3 text-base font-semibold text-foreground shadow-lg shadow-accent/40 transition-opacity hover:opacity-90"
          >
            {heroContent.ctaLabel}
          </Link>
          <Link
            href="#servicios"
            className="inline-block rounded-lg border border-accent/40 bg-white/[0.02] px-8 py-3 text-base font-semibold text-foreground transition-colors hover:border-accent"
          >
            Ver servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
