create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null references public.achievements (id),
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "user_achievements_select_own" on public.user_achievements
  for select using ((select auth.uid()) = user_id);
create policy "user_achievements_insert_own" on public.user_achievements
  for insert with check ((select auth.uid()) = user_id);
-- Immutable unlock log: no update/delete.
