import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getUser, type User } from "@/lib/auth";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Perfil — EcoTrack" }] }),
  component: ProfilePage,
});

const achievements = [
  { icon: "🚲", title: "Movilidad sostenible", desc: "Usaste bicicleta 5 días seguidos", date: "12/05/2026" },
  { icon: "♻️", title: "Reciclador estrella", desc: "Reciclaste durante 14 días", date: "11/05/2026" },
  { icon: "⚡", title: "Energía consciente", desc: "Uso eficiente durante 7 días", date: "10/05/2026" },
];

function ProfilePage() {
  const [user, setU] = useState<User | null>(null);
  useEffect(() => setU(getUser()), []);

  return (
    <div>
      <PageHeader title="Mi perfil 👤" subtitle="Gestiona tu información personal y visualiza tu progreso" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <p className="mt-4 text-lg font-bold text-foreground">{user?.name ?? "Usuario"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <button className="mt-4 w-full rounded-lg border border-border py-2 text-sm font-medium hover:bg-secondary">
            Editar perfil
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-foreground">Mi progreso</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">120 kg</p>
              <p className="text-xs text-muted-foreground">CO₂e este mes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">28</p>
              <p className="text-xs text-muted-foreground">Hábitos registrados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Metas cumplidas</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Logros</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {achievements.map((a) => (
          <div key={a.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-3xl">{a.icon}</div>
            <p className="mt-2 font-semibold text-foreground">{a.title}</p>
            <p className="text-sm text-muted-foreground">{a.desc}</p>
            <p className="mt-2 text-xs text-muted-foreground">{a.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
