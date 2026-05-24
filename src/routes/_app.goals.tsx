import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/goals")({
  head: () => ({ meta: [{ title: "Metas — EcoTrack" }] }),
  component: GoalsPage,
});

type Goal = { id: string; name: string; current: number; target: number; unit: string; completed: boolean };
type Suggested = { id: string; name: string; target: number; unit: string; description: string | null };

function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [suggested, setSuggested] = useState<Suggested[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: g }, { data: s }] = await Promise.all([
      supabase.from("goals").select("*").order("created_at"),
      supabase.from("suggested_goals").select("*"),
    ]);
    setGoals((g ?? []) as Goal[]);
    setSuggested((s ?? []) as Suggested[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const adopt = async (sg: Suggested) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("goals").insert({
      user_id: u.user.id,
      name: sg.name,
      target: sg.target,
      unit: sg.unit,
      current: 0,
    });
    if (error) return toast.error(error.message);
    toast.success("Meta agregada");
    load();
  };

  const active = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

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
            const pct = Math.min(100, Math.round((Number(g.current) / Number(g.target)) * 100));
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
