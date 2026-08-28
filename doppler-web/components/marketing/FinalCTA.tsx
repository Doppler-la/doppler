import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-primary/30 to-background px-6 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Más que una software factory, un equipo que impulsa tu negocio
        </h2>
        <Link
          href="#contacto"
          className="bg-brand-gradient mt-8 inline-block rounded-lg px-8 py-3 text-base font-semibold text-foreground shadow-lg shadow-accent/40 transition-opacity hover:opacity-90"
        >
          Empecemos
        </Link>
      </div>
    </section>
  );
}
