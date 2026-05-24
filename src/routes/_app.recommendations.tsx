import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/recommendations")({
  head: () => ({ meta: [{ title: "Recomendaciones — EcoTrack" }] }),
  component: RecsPage,
});

type Rec = { id: string; icon: string | null; title: string; description: string };

function RecsPage() {
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("recommendations")
      .select("*")
      .order("created_at")
      .then(({ data }) => {
        setRecs((data ?? []) as Rec[]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <PageHeader title="Recomendaciones 💡" subtitle="Sigue estas recomendaciones y reduce tu impacto ambiental" />

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recs.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="text-3xl">{r.icon}</div>
              <p className="mt-3 font-semibold text-foreground">{r.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-border bg-accent p-6 text-center">
        <p className="text-lg font-semibold text-accent-foreground">¡Cada acción cuenta! 🌍</p>
      </div>
    </div>
  );
}
