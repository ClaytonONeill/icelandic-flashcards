create table public.vocab_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  english_word text not null,
  icelandic_word text not null,
  word_type word_type not null,
  strength word_strength,
  dictionary_entry jsonb not null, -- cached GrammarTable (see forms-to-table.ts) for this word's flip-side view
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, icelandic_word)
);

create index vocab_list_user_id_idx on public.vocab_list (user_id);
create index vocab_list_user_word_type_idx on public.vocab_list (user_id, word_type);

alter table public.vocab_list enable row level security;

create policy "vocab_list_select_own" on public.vocab_list
  for select using ((select auth.uid()) = user_id);
create policy "vocab_list_insert_own" on public.vocab_list
  for insert with check ((select auth.uid()) = user_id);
create policy "vocab_list_update_own" on public.vocab_list
  for update using ((select auth.uid()) = user_id);
create policy "vocab_list_delete_own" on public.vocab_list
  for delete using ((select auth.uid()) = user_id);

create trigger vocab_list_set_updated_at
  before update on public.vocab_list
  for each row execute function public.set_updated_at();
