import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/recommendations")({
  head: () => ({ meta: [{ title: "Recomendaciones — EcoTrack" }] }),
  component: RecsPage,
});

const recs = [
  { icon: "🚌", title: "Usa transporte público", desc: "Reduce hasta 4 kg CO₂e por trayecto frente al carro." },
  { icon: "⚡", title: "Apaga luces innecesarias", desc: "Disminuye tu consumo energético al final del día." },
  { icon: "♻️", title: "Recicla plástico y papel", desc: "Separa residuos al menos 3 veces por semana." },
  { icon: "🥦", title: "Come vegetariano 2 veces/semana", desc: "Disminuye la huella alimentaria." },
  { icon: "💡", title: "Usa focos LED", desc: "Reduce hasta 80% el consumo eléctrico de iluminación." },
  { icon: "🚿", title: "Acorta tus duchas", desc: "Ahorra agua y energía cada día." },
];

function RecsPage() {
  return (
    <div>
      <PageHeader title="Recomendaciones 💡" subtitle="Sigue estas recomendaciones y reduce tu impacto ambiental" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recs.map((r) => (
          <div key={r.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-3xl">{r.icon}</div>
            <p className="mt-3 font-semibold text-foreground">{r.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-accent p-6 text-center">
        <p className="text-lg font-semibold text-accent-foreground">¡Cada acción cuenta! 🌍</p>
      </div>
    </div>
  );
}
