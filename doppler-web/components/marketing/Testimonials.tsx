import { testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Lo que dicen de nosotros
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.author}
              className="rounded-lg border border-primary/40 bg-background p-6"
            >
              <p className="text-sm italic text-muted">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-foreground">
                {t.author}
                <span className="block text-xs font-normal text-muted">
                  {t.role} · {t.company}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
