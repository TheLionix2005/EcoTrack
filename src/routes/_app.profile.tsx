// VIEW — Perfil. Solo usa ProfileController.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProfileController } from "@/controllers/profile.controller";
import type { Profile } from "@/models/types";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Perfil — EcoTrack" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habitsCount, setHabitsCount] = useState(0);
  const [goalsDone, setGoalsDone] = useState(0);
  const [totalCo2, setTotalCo2] = useState(0);

  useEffect(() => {
    ProfileController.loadDashboard().then((data) => {
      if (!data) return;
      setProfile(data.profile);
      setHabitsCount(data.habitsCount);
      setTotalCo2(data.totalCo2);
      setGoalsDone(data.goalsDone);
    });
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
