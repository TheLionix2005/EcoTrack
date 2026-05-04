import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Historial — EcoTrack" }] }),
  component: HistoryPage,
});

const rows = [
  { date: "20/05/2026", cat: "Transporte", act: "Bus al trabajo", kg: "5 kg" },
  { date: "20/05/2026", cat: "Energía", act: "Uso de electricidad", kg: "8 kg" },
  { date: "19/05/2026", cat: "Alimentación", act: "Almuerzo vegetariano", kg: "3 kg" },
  { date: "19/05/2026", cat: "Residuos", act: "Reciclaje de plástico", kg: "2 kg" },
  { date: "18/05/2026", cat: "Transporte", act: "Bicicleta", kg: "0 kg" },
  { date: "18/05/2026", cat: "Energía", act: "Apagado de luces innecesarias", kg: "1 kg" },
];

function HistoryPage() {
  return (
    <div>
      <PageHeader title="Historial" subtitle="Consulta el registro de tu impacto ambiental" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Actividad</th>
              <th className="px-4 py-3 text-right">Impacto (CO₂e)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-4 py-3 text-foreground">{r.cat}</td>
                <td className="px-4 py-3 text-foreground">{r.act}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{r.kg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Impacto total en el período</p>
          <p className="mt-2 text-2xl font-bold text-foreground">120 kg CO₂e</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Promedio diario</p>
          <p className="mt-2 text-2xl font-bold text-foreground">17.1 kg CO₂e</p>
        </div>
      </div>
    </div>
  );
}
