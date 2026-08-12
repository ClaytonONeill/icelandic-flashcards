-- pgcrypto provides gen_random_uuid(); enabled by default on Supabase but
-- declared explicitly so this migration is reproducible on a fresh Postgres.
create extension if not exists pgcrypto;

create type word_type as enum (
  'noun',
  'adjective',
  'adverb',
  'interjection',
  'conjunction',
  'preposition',
  'verb'
);

create type word_strength as enum ('strong', 'weak');
-- "unassigned" strength is represented as NULL, not a third enum value —
-- keeps "clear strength" a single `update ... set strength = null`.

-- Shared updated_at trigger helper, reused by every table below that has updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
