// MODEL — Acceso a datos para la tabla `habits`.
// Solo lee/escribe en la BD; NO contiene reglas de negocio ni UI.
import { supabase } from "@/integrations/supabase/client";
import type { Habit, NewHabit } from "./types";

export const HabitModel = {
  async listAll(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .order("occurred_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Habit[];
  },

  async create(userId: string, input: NewHabit): Promise<void> {
    const { error } = await supabase.from("habits").insert({
      user_id: userId,
      name: input.name,
      description: input.description ?? null,
      category: input.category ?? null,
      co2_kg: input.co2_kg,
    });
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) throw error;
  },

  async sumCo2(): Promise<{ count: number; total: number }> {
    const { data, error } = await supabase.from("habits").select("co2_kg");
    if (error) throw error;
    const rows = data ?? [];
    return {
      count: rows.length,
      total: rows.reduce((s, r) => s + Number(r.co2_kg), 0),
    };
  },
};
