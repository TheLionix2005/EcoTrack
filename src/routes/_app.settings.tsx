// VIEW — Configuración. Solo usa ProfileController y AuthController.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProfileController } from "@/controllers/profile.controller";
import { AuthController } from "@/controllers/auth.controller";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Configuración — EcoTrack" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ProfileController.loadForSettings().then((data) => {
      if (!data) return;
      setUserId(data.userId);
      setName(data.name);
      setEmail(data.email);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ProfileController.updateName(userId, name);
      toast.success("Perfil actualizado");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await AuthController.signOut();
    navigate({ to: "/login" });
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Correo</label>
            <input
              value={email}
              disabled
              className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Sesión</h2>
        <button
          onClick={handleSignOut}
          className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90"
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  );
}
