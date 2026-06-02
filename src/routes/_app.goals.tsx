// VIEW — Página de metas. Solo usa GoalsController.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GoalsController } from "@/controllers/goals.controller";
import type { Goal, SuggestedGoal } from "@/models/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/goals")({
  head: () => ({ meta: [{ title: "Metas — EcoTrack" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [suggested, setSuggested] = useState<SuggestedGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { goals, suggested } = await GoalsController.loadAll();
      setGoals(goals);
      setSuggested(suggested);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const adopt = async (sg: SuggestedGoal) => {
    try {
      await GoalsController.adoptSuggested(sg);
      toast.success("Meta agregada");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const { active, completed } = GoalsController.splitActiveCompleted(goals);

  return (
    <div>
      <PageHeader title="Metas 🎯" subtitle="Define objetivos y mide tu progreso" />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Activas</h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : active.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tienes metas activas. Agrega una desde las sugeridas.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {active.map((g) => {
            const pct = GoalsController.progressPct(g);
            return (
              <div key={g.id} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-semibold text-foreground">{g.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {Number(g.current)} / {Number(g.target)} {g.unit}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-primary">{pct}% completado</p>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sugeridas</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suggested.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-semibold text-foreground">{s.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Objetivo: {s.target} {s.unit}
            </p>
            <button
              onClick={() => adopt(s)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-3 w-3" /> Adoptar
            </button>
          </div>
        ))}
      </div>

      {completed.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cumplidas</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Meta</th>
                  <th className="px-4 py-3">Objetivo</th>
                  <th className="px-4 py-3">Logrado</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((g) => (
                  <tr key={g.id} className="border-t border-border">
                    <td className="px-4 py-3">{g.name}</td>
                    <td className="px-4 py-3">{Number(g.target)} {g.unit}</td>
                    <td className="px-4 py-3">{Number(g.current)} {g.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
