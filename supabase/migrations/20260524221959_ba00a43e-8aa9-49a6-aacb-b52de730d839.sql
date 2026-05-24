
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles: select own" on public.profiles for select using (auth.uid() = id);
create policy "Profiles: insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles: update own" on public.profiles for update using (auth.uid() = id);

-- CATEGORIES (public catalog)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "Categories: read all authenticated" on public.categories for select to authenticated using (true);

-- RECOMMENDATIONS (public catalog)
create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  icon text,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);
alter table public.recommendations enable row level security;
create policy "Recs: read all authenticated" on public.recommendations for select to authenticated using (true);

-- SUGGESTED GOALS (public catalog)
create table public.suggested_goals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  target numeric not null,
  unit text not null,
  description text,
  created_at timestamptz not null default now()
);
alter table public.suggested_goals enable row level security;
create policy "SG: read all authenticated" on public.suggested_goals for select to authenticated using (true);

-- HABITS (per user)
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  category text,
  co2_kg numeric not null default 0,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.habits enable row level security;
create policy "Habits: select own" on public.habits for select using (auth.uid() = user_id);
create policy "Habits: insert own" on public.habits for insert with check (auth.uid() = user_id);
create policy "Habits: update own" on public.habits for update using (auth.uid() = user_id);
create policy "Habits: delete own" on public.habits for delete using (auth.uid() = user_id);
create index habits_user_occurred_idx on public.habits (user_id, occurred_at desc);

-- GOALS (per user)
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  current numeric not null default 0,
  target numeric not null,
  unit text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.goals enable row level security;
create policy "Goals: select own" on public.goals for select using (auth.uid() = user_id);
create policy "Goals: insert own" on public.goals for insert with check (auth.uid() = user_id);
create policy "Goals: update own" on public.goals for update using (auth.uid() = user_id);
create policy "Goals: delete own" on public.goals for delete using (auth.uid() = user_id);

-- Trigger: handle new user → create profile + seed habits/goals
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, full_name, email)
  values (new.id, v_name, new.email)
  on conflict (id) do nothing;

  -- Seed example habits
  insert into public.habits (user_id, name, description, category, co2_kg, occurred_at) values
    (new.id, 'Transporte público', 'Usé bus para ir al trabajo', 'Transporte', 5, now() - interval '2 hours'),
    (new.id, 'Uso de bicicleta', 'Fui al trabajo en bicicleta', 'Transporte', 0, now() - interval '1 day'),
    (new.id, 'Reciclaje', 'Reciclé plástico y papel', 'Residuos', 2, now() - interval '3 hours');

  -- Seed starting goals
  insert into public.goals (user_id, name, current, target, unit) values
    (new.id, 'Reducir CO₂e mensual', 120, 200, 'kg'),
    (new.id, 'Usar transporte sostenible', 5, 8, 'días');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
