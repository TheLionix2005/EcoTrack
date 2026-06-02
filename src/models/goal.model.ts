// MODEL — Acceso a datos para `goals` y `suggested_goals`.
import { supabase } from "@/integrations/supabase/client";
import type { Goal, SuggestedGoal } from "./types";

export const GoalModel = {
  async listAll(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at");
    if (error) throw error;
    return (data ?? []) as Goal[];
  },

  async listSuggested(): Promise<SuggestedGoal[]> {
    const { data, error } = await supabase.from("suggested_goals").select("*");
    if (error) throw error;
    return (data ?? []) as SuggestedGoal[];
  },

  async create(
    userId: string,
    input: { name: string; target: number; unit: string; current?: number },
  ): Promise<void> {
    const { error } = await supabase.from("goals").insert({
      user_id: userId,
      name: input.name,
      target: input.target,
      unit: input.unit,
      current: input.current ?? 0,
    });
    if (error) throw error;
  },

  async countCompleted(): Promise<number> {
    const { data, error } = await supabase.from("goals").select("completed");
    if (error) throw error;
    return (data ?? []).filter((g) => g.completed).length;
  },
};
