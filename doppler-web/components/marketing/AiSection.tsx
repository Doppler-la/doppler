import { Workflow, Sparkles, Plug, TrendingUp } from "lucide-react";
import { aiSection, type CapabilityItem } from "@/lib/content";

const icons: Record<CapabilityItem["icon"], typeof Workflow> = {
  workflow: Workflow,
  sparkles: Sparkles,
  plug: Plug,
  "trending-up": TrendingUp,
};

export default function AiSection() {
  return (
    <section id="ia" className="bg-gradient-to-b from-background to-primary/20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">{aiSection.headline}</h2>
          <p className="mt-4 text-muted">{aiSection.subheadline}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aiSection.capabilities.map((capability) => {
            const Icon = icons[capability.icon];
            return (
              <div
                key={capability.title}
                className="rounded-lg border border-primary/40 bg-surface p-6"
              >
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-3 font-semibold text-foreground">{capability.title}</h3>
                <p className="mt-2 text-sm text-muted">{capability.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {aiSection.methodology.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-background">
                {step.step}
              </div>
              <h4 className="mt-3 font-semibold text-foreground">{step.title}</h4>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
