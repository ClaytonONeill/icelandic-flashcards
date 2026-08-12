create table public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null,
  reason text not null, -- e.g. 'deck_completed', 'achievement_unlocked'
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index points_transactions_user_id_idx
  on public.points_transactions (user_id, created_at desc);

alter table public.points_transactions enable row level security;

create policy "points_transactions_select_own" on public.points_transactions
  for select using ((select auth.uid()) = user_id);
create policy "points_transactions_insert_own" on public.points_transactions
  for insert with check ((select auth.uid()) = user_id);
-- Append-only ledger by design: no update or delete policy at all.

-- Keeps profiles.points_balance authoritative and always in sync with the
-- ledger, so no code path can update balance without also writing a row here.
create or replace function public.apply_points_transaction()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
    set points_balance = points_balance + new.amount, updated_at = now()
    where id = new.user_id;
  return new;
end;
$$;

create trigger points_transactions_apply
  after insert on public.points_transactions
  for each row execute function public.apply_points_transaction();
