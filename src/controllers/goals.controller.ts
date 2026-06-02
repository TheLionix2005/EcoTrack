// CONTROLLER — Reglas de negocio para metas.
import { GoalModel } from "@/models/goal.model";
import { AuthController } from "./auth.controller";
import type { Goal, SuggestedGoal } from "@/models/types";

export const GoalsController = {
  async loadAll() {
    const [goals, suggested] = await Promise.all([
      GoalModel.listAll(),
      GoalModel.listSuggested(),
    ]);
    return { goals, suggested };
  },

  async adoptSuggested(sg: SuggestedGoal) {
    const userId = await AuthController.getCurrentUserId();
    if (!userId) throw new Error("Sesión expirada");
    await GoalModel.create(userId, {
      name: sg.name,
      target: sg.target,
      unit: sg.unit,
      current: 0,
    });
  },

  splitActiveCompleted(goals: Goal[]) {
    return {
      active: goals.filter((g) => !g.completed),
      completed: goals.filter((g) => g.completed),
    };
  },

  progressPct(g: Goal): number {
    if (!g.target) return 0;
    return Math.min(100, Math.round((Number(g.current) / Number(g.target)) * 100));
  },
};
