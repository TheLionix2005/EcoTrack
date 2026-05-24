import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Perfil — EcoTrack" }] }),
  component: ProfilePage,
});

type Profile = { id: string; full_name: string | null; email: string | null };

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habitsCount, setHabitsCount] = useState(0);
  const [goalsDone, setGoalsDone] = useState(0);
  const [totalCo2, setTotalCo2] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [{ data: p }, { data: h }, { data: g }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle(),
        supabase.from("habits").select("co2_kg"),
        supabase.from("goals").select("completed"),
      ]);
      setProfile((p ?? null) as Profile | null);
      setHabitsCount(h?.length ?? 0);
      setTotalCo2((h ?? []).reduce((s, x) => s + Number(x.co2_kg), 0));
      setGoalsDone((g ?? []).filter((x) => x.completed).length);
    })();
  }, []);

  return (
    <div>
      <PageHeader title="Mi perfil 👤" subtitle="Gestiona tu información personal y visualiza tu progreso" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground">
            {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <p className="mt-4 text-lg font-bold text-foreground">{profile?.full_name ?? "Usuario"}</p>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-foreground">Mi progreso</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{totalCo2.toFixed(1)} kg</p>
              <p className="text-xs text-muted-foreground">CO₂e registrado</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{habitsCount}</p>
              <p className="text-xs text-muted-foreground">Hábitos registrados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{goalsDone}</p>
              <p className="text-xs text-muted-foreground">Metas cumplidas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
