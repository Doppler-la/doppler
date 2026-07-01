import { Code2, Bot, Lightbulb } from "lucide-react";
import { services, type ServiceItem } from "@/lib/content";

const icons: Record<ServiceItem["icon"], typeof Code2> = {
  code: Code2,
  bot: Bot,
  lightbulb: Lightbulb,
};

export default function Services() {
  return (
    <section id="servicios" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Qué hacemos
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <div
                key={service.title}
                className="rounded-lg border border-primary/40 bg-background p-8"
              >
                <Icon className="h-8 w-8 text-accent" />
                <h3 className="mt-4 text-xl font-semibold text-foreground">{service.title}</h3>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
