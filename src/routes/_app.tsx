// VIEW — Layout autenticado. Usa AuthController para guard de sesión.
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthController } from "@/controllers/auth.controller";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    AuthController.getCurrentSession().then((session) => {
      if (!active) return;

      if (!session) {
        navigate({ to: "/login" });
        return;
      }

      const meta = session.user.user_metadata as {
        full_name?: string;
        name?: string;
      };

      setDisplayName(
        meta.full_name ??
          meta.name ??
          session.user.email?.split("@")[0] ??
          "Usuario"
      );

      setReady(true);
    });

    const { data: sub } = AuthController.onAuthChange((signedIn) => {
      if (!signedIn) navigate({ to: "/login" });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  // 👉 MAZE SNIPPET (CORRECTO)
  useEffect(() => {
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

  if (!ready) return null;

  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground">
                📅 {today}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="rounded-full p-2 hover:bg-secondary"
                aria-label="Notificaciones"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
              </button>

              <span className="text-sm text-foreground">
                👤 <span className="font-medium">{displayName}</span>
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
