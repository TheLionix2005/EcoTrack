// CONTROLLER — Lógica para perfil del usuario y estadísticas agregadas.
import { ProfileModel } from "@/models/profile.model";
import { HabitModel } from "@/models/habit.model";
import { GoalModel } from "@/models/goal.model";
import { AuthController } from "./auth.controller";
import { supabase } from "@/integrations/supabase/client";

export const ProfileController = {
  async loadDashboard() {
    const userId = await AuthController.getCurrentUserId();
    if (!userId) return null;
    const [profile, habits, completed] = await Promise.all([
      ProfileModel.findById(userId),
      HabitModel.sumCo2(),
      GoalModel.countCompleted(),
    ]);
    return {
      profile,
      habitsCount: habits.count,
      totalCo2: habits.total,
      goalsDone: completed,
    };
  },

  async loadForSettings() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return null;
    const profile = await ProfileModel.findById(user.id);
    return {
      userId: user.id,
      name: profile?.full_name ?? "",
      email: profile?.email ?? user.email ?? "",
    };
  },

  async updateName(userId: string, fullName: string) {
    if (!fullName.trim()) throw new Error("El nombre no puede estar vacío");
    await ProfileModel.updateName(userId, fullName.trim());
  },
};
