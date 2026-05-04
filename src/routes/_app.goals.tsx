import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/goals")({
  head: () => ({ meta: [{ title: "Metas — EcoTrack" }] }),
  component: GoalsPage,
});

const active = [
  { name: "Reducir CO₂e mensual", current: 120, target: 200, unit: "kg" },
  { name: "Usar transporte sostenible", current: 5, target: 8, unit: "días" },
  { name: "Reciclar más residuos", current: 6, target: 10, unit: "veces" },
];

const completed = [
  { period: "Marzo 2026", target: "450 kg", actual: "420 kg" },
  { period: "Febrero 2026", target: "420 kg", actual: "405 kg" },
  { period: "Enero 2026", target: "400 kg", actual: "390 kg" },
];

function GoalsPage() {
  return (
    <div>
      <PageHeader title="Metas 🎯" subtitle="Define objetivos y mide tu progreso" />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Activas</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {active.map((g) => {
          const pct = Math.round((g.current / g.target) * 100);
          return (
            <div key={g.name} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground">{g.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {g.current} / {g.target} {g.unit}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-primary">{pct}% completado</p>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cumplidas</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Periodo</th>
              <th className="px-4 py-3">Meta</th>
              <th className="px-4 py-3">Real</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((r) => (
              <tr key={r.period} className="border-t border-border">
                <td className="px-4 py-3">{r.period}</td>
                <td className="px-4 py-3">{r.target}</td>
                <td className="px-4 py-3">{r.actual}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                    ✓ Cumplida
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¡Cada meta te acerca a un planeta más saludable! 🌎
      </p>
    </div>
  );
}
