// CONTROLLER — Historial: reutiliza HabitModel y calcula totales.
import { HabitModel } from "@/models/habit.model";

export const HistoryController = {
  async loadAll() {
    const rows = await HabitModel.listAll();
    const total = rows.reduce((s, r) => s + Number(r.co2_kg), 0);
    const avg = rows.length ? total / rows.length : 0;
    return { rows, total, avg };
  },
};
