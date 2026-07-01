import { clientLogos } from "@/lib/content";

export default function ClientLogos() {
  return (
    <section id="clientes" className="px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Empresas que confiaron en nosotros
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {clientLogos.map((logo, index) => (
            <div
              key={index}
              className="flex h-16 items-center justify-center rounded-md border border-primary/40 bg-surface text-sm text-muted opacity-60"
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
