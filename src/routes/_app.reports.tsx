import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reportes — EcoTrack" }] }),
  component: ReportsPage,
});

const months = [
  { m: "Ene", v: 390 },
  { m: "Feb", v: 405 },
  { m: "Mar", v: 420 },
  { m: "Abr", v: 360 },
  { m: "May", v: 300 },
  { m: "Jun", v: 280 },
];

function ReportsPage() {
  const max = Math.max(...months.map((m) => m.v));
  return (
    <div>
      <PageHeader title="Reportes 📊" subtitle="Analiza tu evolución a lo largo del tiempo" />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Promedio mensual</p>
          <p className="mt-2 text-2xl font-bold text-foreground">359 kg CO₂e</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Mejor mes</p>
          <p className="mt-2 text-2xl font-bold text-primary">Junio · 280 kg</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Reducción anual</p>
          <p className="mt-2 text-2xl font-bold text-primary">↓ 28%</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Impacto mensual (kg CO₂e)</h3>
        <div className="flex h-56 items-end gap-4">
          {months.map((m) => (
            <div key={m.m} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-foreground">{m.v}</span>
              <div
                className="w-full rounded-t-md bg-primary/80"
                style={{ height: `${(m.v / max) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">{m.m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Descargar PDF
        </button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          Exportar CSV
        </button>
      </div>
    </div>
  );
}
