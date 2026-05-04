import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EcoTrack" }] }),
  component: DashboardPage,
});

const stats = [
  { label: "Impacto total", value: "120", unit: "kg CO₂e", note: "↓ 15% vs. mes pasado" },
  { label: "Meta mensual", value: "200", unit: "kg CO₂e", note: "60% de tu meta" },
  { label: "Tendencia", value: "↓ 15%", unit: "", note: "vs. semana pasada" },
  { label: "Nivel de impacto", value: "Medio", unit: "", note: "Sigue mejorando" },
];

const week = [
  { day: "Lun", v: 45 },
  { day: "Mar", v: 75 },
  { day: "Mié", v: 60 },
  { day: "Jue", v: 130 },
  { day: "Vie", v: 130 },
  { day: "Sáb", v: 180 },
  { day: "Dom", v: 100 },
];

const categories = [
  { label: "Transporte", pct: 45, kg: 54 },
  { label: "Energía", pct: 25, kg: 30 },
  { label: "Alimentación", pct: 20, kg: 24 },
  { label: "Residuos", pct: 10, kg: 12 },
];

function DashboardPage() {
  const max = Math.max(...week.map((w) => w.v));
  return (
    <div>
      <PageHeader title="¡Bienvenido User! 🌿" subtitle="Consejos personalizados para reducir tu impacto ambiental" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {s.value} <span className="text-sm font-normal text-muted-foreground">{s.unit}</span>
            </p>
            <p className="mt-1 text-xs text-primary">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-foreground">Evolución de tu impacto (CO₂e)</h3>
          <div className="flex h-48 items-end gap-3">
            {week.map((w) => (
              <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-primary/80"
                  style={{ height: `${(w.v / max) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{w.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Impacto por categoría</h3>
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{c.label}</span>
                  <span className="text-muted-foreground">{c.kg} kg ({c.pct}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Recomendaciones para ti</h3>
          <ul className="space-y-3 text-sm">
            <li className="rounded-lg bg-secondary p-3">🚌 Usa transporte público al menos 3 veces esta semana.</li>
            <li className="rounded-lg bg-secondary p-3">⚡ Reduce tu consumo eléctrico en horas pico.</li>
            <li className="rounded-lg bg-secondary p-3">♻️ Recicla plástico al menos 2 veces esta semana.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Tus metas</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Reducir CO₂e mensual</span><span className="text-muted-foreground">120 / 200 kg</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: "60%" }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Transporte sostenible</span><span className="text-muted-foreground">5 / 8 días</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: "62%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
