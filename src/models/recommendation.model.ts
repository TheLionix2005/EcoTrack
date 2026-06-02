// MODEL — Acceso a datos para `recommendations`.
import { supabase } from "@/integrations/supabase/client";
import type { Recommendation } from "./types";

export const RecommendationModel = {
  async listAll(): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .order("created_at");
    if (error) throw error;
    return (data ?? []) as Recommendation[];
  },
};
