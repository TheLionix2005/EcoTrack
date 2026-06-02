// MODEL — Tipos del dominio (espejo de las tablas de la BD)

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  co2_kg: number;
  occurred_at: string;
  created_at: string;
};

export type NewHabit = {
  name: string;
  description?: string | null;
  category?: string | null;
  co2_kg: number;
};

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  created_at: string;
};

export type SuggestedGoal = {
  id: string;
  name: string;
  description: string | null;
  target: number;
  unit: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string | null;
};

export type Recommendation = {
  id: string;
  icon: string | null;
  title: string;
  description: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};
