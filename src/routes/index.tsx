import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/ecotrack-hero.jpg";
import logo from "@/assets/ecotrack-logo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoTrack — Reduce tu impacto ambiental" },
      { name: "description", content: "Tu aliado para tomar decisiones conscientes y reducir tu impacto ambiental." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <img src={logo} alt="EcoTrack" className="h-9" />
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Bienvenido a <span className="text-primary">EcoTrack</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Tu aliado para tomar decisiones conscientes y reducir tu impacto ambiental.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
        <img src={heroImg} alt="Únete a EcoTrack" className="rounded-2xl shadow-xl" />
      </main>
    </div>
  );
}
