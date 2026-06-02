// VIEW — Historial. Solo usa HistoryController.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { HistoryController } from "@/controllers/history.controller";
import type { Habit } from "@/models/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Historial — EcoTrack" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [rows, setRows] = useState<Habit[]>([]);
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    HistoryController.loadAll()
      .then(({ rows, total, avg }) => {
        setRows(rows);
        setTotal(total);
        setAvg(avg);
      })
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

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
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Cargando...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Aún no hay registros.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.occurred_at).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3 text-foreground">{r.category}</td>
                  <td className="px-4 py-3 text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{Number(r.co2_kg)} kg</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Impacto total acumulado</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{total.toFixed(1)} kg CO₂e</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Promedio por registro</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{avg.toFixed(1)} kg CO₂e</p>
        </div>
      </div>
    </div>
  );
}
