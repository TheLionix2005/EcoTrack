// VIEW — Página de hábitos. Solo usa HabitsController.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { HabitsController } from "@/controllers/habits.controller";
import type { Habit, Category } from "@/models/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/habits")({
  head: () => ({ meta: [{ title: "Mis hábitos — EcoTrack" }] }),
  component: HabitsPage,
});

const baseFilters = ["Todos"];

function HabitsPage() {
  const [active, setActive] = useState("Todos");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "Transporte", co2_kg: "" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { habits, categories } = await HabitsController.loadAll();
      setHabits(habits);
      setCategories(categories);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filters = [...baseFilters, ...categories.map((c) => c.name)];
  const list = HabitsController.filterByCategory(habits, active);
  const total = HabitsController.sumCo2(list);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await HabitsController.addHabit({
        name: form.name,
        description: form.description,
        category: form.category,
        co2_kg: Number(form.co2_kg) || 0,
      });
      toast.success("Hábito agregado");
      setOpen(false);
      setForm({ name: "", description: "", category: "Transporte", co2_kg: "" });
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await HabitsController.deleteHabit(id);
      toast.success("Hábito eliminado");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="Mis hábitos 🌿" subtitle="Registra y gestiona tus hábitos diarios" />
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Agregar hábito
        </button>
      </div>

      {open && (
        <form onSubmit={handleAdd} className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-2">
          <input
            required
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.1"
            required
            placeholder="CO₂e (kg)"
            value={form.co2_kg}
            onChange={(e) => setForm({ ...form, co2_kg: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <button className="md:col-span-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground">
            Guardar hábito
          </button>
        </form>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === f
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Registrados</h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay hábitos en esta categoría.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((h) => (
            <li key={h.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <div>
                <p className="font-semibold text-foreground">{h.name}</p>
                <p className="text-sm text-muted-foreground">{h.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{h.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-primary">{Number(h.co2_kg)} kg CO₂e</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.occurred_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-accent p-5 text-center">
        <p className="text-sm text-accent-foreground">Total ({active})</p>
        <p className="text-2xl font-bold text-accent-foreground">{total.toFixed(1)} kg CO₂e</p>
        <p className="mt-1 text-sm text-accent-foreground">¡Sigue así! Cada acción cuenta 🌿</p>
      </div>
    </div>
  );
}
