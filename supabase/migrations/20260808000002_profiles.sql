create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  points_balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id);

-- No insert/delete policy: rows are created only by handle_new_user() below and
-- are never deleted directly by a user (they cascade from auth.users deletion).

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Standard Supabase "auto-provision profile" pattern: fires once, exactly when
-- a new auth.users row is created, regardless of which auth flow created it
-- (email/password signup today, magic link/OAuth if added later).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
