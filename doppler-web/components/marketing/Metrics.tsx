import { metrics } from "@/lib/content";

export default function Metrics() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="text-4xl font-bold text-accent">{metric.value}</div>
            <div className="mt-2 text-sm text-muted">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
