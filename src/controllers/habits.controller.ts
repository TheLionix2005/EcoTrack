// CONTROLLER — Reglas de negocio para hábitos.
// Valida, obtiene el usuario actual y delega persistencia al MODEL.
import { HabitModel } from "@/models/habit.model";
import { CategoryModel } from "@/models/category.model";
import { AuthController } from "./auth.controller";
import type { NewHabit } from "@/models/types";

export const HabitsController = {
  async loadAll() {
    const [habits, categories] = await Promise.all([
      HabitModel.listAll(),
      CategoryModel.listAll(),
    ]);
    return { habits, categories };
  },

  async addHabit(input: NewHabit) {
    if (!input.name?.trim()) throw new Error("El nombre es obligatorio");
    if (Number.isNaN(input.co2_kg)) throw new Error("CO₂e inválido");
    const userId = await AuthController.getCurrentUserId();
    if (!userId) throw new Error("Sesión expirada");
    await HabitModel.create(userId, input);
  },

  async deleteHabit(id: string) {
    await HabitModel.remove(id);
  },

  filterByCategory<T extends { category: string | null }>(
    list: T[],
    category: string,
  ): T[] {
    return category === "Todos" ? list : list.filter((h) => h.category === category);
  },

  sumCo2<T extends { co2_kg: number }>(list: T[]): number {
    return list.reduce((s, h) => s + Number(h.co2_kg), 0);
  },
};
