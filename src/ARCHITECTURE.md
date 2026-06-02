# Arquitectura MVC — EcoTrack

Este proyecto sigue el patrón **Model–View–Controller (MVC)** aplicado a una SPA
con TanStack Start + Supabase. Aunque todo el código corre en el navegador,
las responsabilidades están separadas por carpeta para que el equipo distinga
claramente **backend (datos + lógica)** de **frontend (UI)**.

```
src/
├── models/          ← MODEL — Acceso a datos (BACK)
│   ├── types.ts            (tipos del dominio, espejo de las tablas)
│   ├── habit.model.ts
│   ├── goal.model.ts
│   ├── category.model.ts
│   ├── recommendation.model.ts
│   └── profile.model.ts
│
├── controllers/     ← CONTROLLER — Lógica de negocio (BACK)
│   ├── auth.controller.ts
│   ├── habits.controller.ts
│   ├── goals.controller.ts
│   ├── profile.controller.ts
│   ├── recommendations.controller.ts
│   └── history.controller.ts
│
├── routes/          ← VIEW — Páginas (FRONT)
├── components/      ← VIEW — UI reutilizable (FRONT)
├── hooks/           ← VIEW — Estado del cliente (FRONT)
│
└── integrations/supabase/   ← infraestructura BD (auto-generada)

supabase/migrations/         ← MODEL — Esquema de la BD (SQL)
```

## Responsabilidades

### Model (`src/models/`)
- **Solo** hace queries a Supabase. No conoce React.
- Devuelve tipos fuertes (`Habit`, `Goal`, etc.) desde `types.ts`.
- Lanza el `error` de Supabase tal cual; el controller decide qué hacer.

### Controller (`src/controllers/`)
- Llama a uno o varios models.
- Valida entradas, obtiene el usuario actual (`AuthController`), aplica
  reglas de negocio (filtros, totales, progreso).
- No conoce JSX. Devuelve datos planos o lanza `Error`.

### View (`src/routes/` + `src/components/`)
- Renderiza UI con React.
- **Nunca** importa de `@/integrations/supabase/client` directamente.
- **Solo** importa de `@/controllers/*` para acciones y datos.
- Maneja `useState`, `useEffect`, `toast`, navegación.

## Regla de oro

```
View  →  Controller  →  Model  →  Supabase
```

Una vista nunca salta al model ni al cliente de Supabase. Si necesitas un
dato nuevo: añade un método al model, expónlo en el controller, consúmelo en
la vista.

## Ejemplo

```tsx
// VIEW: src/routes/_app.habits.tsx
import { HabitsController } from "@/controllers/habits.controller";

const { habits, categories } = await HabitsController.loadAll();
await HabitsController.addHabit({ name, co2_kg: 5, category: "Transporte" });
```

```ts
// CONTROLLER: src/controllers/habits.controller.ts
async addHabit(input: NewHabit) {
  if (!input.name?.trim()) throw new Error("El nombre es obligatorio");
  const userId = await AuthController.getCurrentUserId();
  if (!userId) throw new Error("Sesión expirada");
  await HabitModel.create(userId, input);   // ← delega al model
}
```

```ts
// MODEL: src/models/habit.model.ts
async create(userId: string, input: NewHabit) {
  const { error } = await supabase.from("habits").insert({ ...input, user_id: userId });
  if (error) throw error;
}
```
