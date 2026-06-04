import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import heroImg from "@/assets/ecotrack-hero.jpg";
import logo from "@/assets/ecotrack-logo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoTrack — Reduce tu impacto ambiental" },
      {
        name: "description",
        content:
          "Tu aliado para tomar decisiones conscientes y reducir tu impacto ambiental.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  // 👉 MAZE SNIPPET
  useEffect(() => {
    // evita duplicados
    if ((window as any).mazeUniversalSnippetApiKey) return;

    const script = document.createElement("script");

    script.innerHTML = `
      (function (m, a, z, e) {
        var s, t, u, v;
        try {
          t = m.sessionStorage.getItem('maze-us');
        } catch (err) {}

        if (!t) {
          t = new Date().getTime();
          try {
            m.sessionStorage.setItem('maze-us', t);
          } catch (err) {}
        }

        u = document.currentScript || (function () {
          var w = document.getElementsByTagName('script');
          return w[w.length - 1];
        })();
        v = u && u.nonce;

        s = a.createElement('script');
        s.src = z + '?apiKey=' + e;
        s.async = true;
        if (v) s.setAttribute('nonce', v);
        a.getElementsByTagName('head')[0].appendChild(s);
        m.mazeUniversalSnippetApiKey = e;
      })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'c48d62f2-0ddb-47e4-8bc7-8e632b2ff04c');
    `;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

        <img
          src={heroImg}
          alt="Únete a EcoTrack"
          className="rounded-2xl shadow-xl"
        />
      </main>
    </div>
  );
}
