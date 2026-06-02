// MODEL — Acceso a datos para `profiles`.
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "./types";

export const ProfileModel = {
  async findById(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as Profile | null;
  },

  async updateName(userId: string, fullName: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId);
    if (error) throw error;
  },
};
