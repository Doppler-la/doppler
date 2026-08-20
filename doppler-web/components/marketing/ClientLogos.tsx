import Image from "next/image";
import { clientLogos } from "@/lib/content";

export default function ClientLogos() {
  return (
    <section id="clientes" className="px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Empresas que confiaron en nosotros
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {clientLogos.map((logo, index) => (
            <div
              key={index}
              className="flex h-24 w-40 items-center justify-center overflow-hidden rounded-lg"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
