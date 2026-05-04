import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/habits")({
  head: () => ({ meta: [{ title: "Mis hábitos — EcoTrack" }] }),
  component: HabitsPage,
});

const filters = ["Todos", "Transporte", "Energía", "Alimentación", "Residuos"];

const habits = [
  { name: "Transporte público", desc: "Usé bus para ir al trabajo", co2: "5 kg CO₂e", time: "08:30 a.m.", cat: "Transporte" },
  { name: "Uso de bicicleta", desc: "Fui al trabajo en bicicleta", co2: "0 kg CO₂e", time: "07:45 a.m.", cat: "Transporte" },
  { name: "Uso de electricidad", desc: "Uso moderado de electricidad", co2: "8 kg CO₂e", time: "11:00 a.m.", cat: "Energía" },
  { name: "Alimentación vegetariana", desc: "Almuerzo sin carne", co2: "3 kg CO₂e", time: "01:30 p.m.", cat: "Alimentación" },
  { name: "Reciclaje", desc: "Reciclaje de plástico y papel", co2: "2 kg CO₂e", time: "06:00 p.m.", cat: "Residuos" },
];

function HabitsPage() {
  const [active, setActive] = useState("Todos");
  const list = active === "Todos" ? habits : habits.filter((h) => h.cat === active);

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="Mis hábitos 🌿" subtitle="Registra y gestiona tus hábitos diarios" />
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Agregar hábito
        </button>
      </div>

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

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Hoy</h2>
      <ul className="space-y-3">
        {list.map((h) => (
          <li key={h.name} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div>
              <p className="font-semibold text-foreground">{h.name}</p>
              <p className="text-sm text-muted-foreground">{h.desc}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{h.co2}</p>
              <p className="text-xs text-muted-foreground">{h.time}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-border bg-accent p-5 text-center">
        <p className="text-sm text-accent-foreground">Total de hoy</p>
        <p className="text-2xl font-bold text-accent-foreground">18 kg CO₂e</p>
        <p className="mt-1 text-sm text-accent-foreground">¡Sigue así! Cada acción cuenta 🌿</p>
      </div>
    </div>
  );
}
