import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getUser, clearUser, type User } from "@/lib/auth";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Configuración — EcoTrack" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [user, setU] = useState<User | null>(null);
  useEffect(() => setU(getUser()), []);

  const handleDelete = () => {
    if (confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      clearUser();
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Configuración ⚙️" subtitle="Personaliza tu experiencia en EcoTrack" />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Información de la cuenta</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nombre</label>
            <input
              defaultValue={user?.name ?? ""}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Correo</label>
            <input
              defaultValue={user?.email ?? ""}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Guardar cambios
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Preferencias</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm">Notificaciones por correo</span>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Recordatorios diarios</span>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Modo oscuro</span>
            <input type="checkbox" className="h-4 w-4" />
          </label>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Datos y cuenta</h2>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
            Exportar mis datos
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
            Cerrar todas las sesiones
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90"
          >
            Eliminar cuenta
          </button>
        </div>
      </section>
    </div>
  );
}
