create table public.achievements (
  id text primary key, -- slug, e.g. 'perfect-deck'
  name text not null,
  description text not null,
  points_reward integer not null default 0,
  unlocks_theme text, -- daisyUI theme name, null if points-only
  created_at timestamptz not null default now()
);

alter table public.achievements enable row level security;

-- Definition data: readable by any signed-in user (client needs it to resolve
-- which themes are unlocked), never written by a user.
create policy "achievements_select_all" on public.achievements
  for select to authenticated using (true);

insert into public.achievements (id, name, description, points_reward, unlocks_theme) values
  ('first-deck-completed', 'Fyrsta þrautin',  'Complete your first deck.',                         20, 'cupcake'),
  ('perfect-deck',         'Fullkomið!',       'Get every card right in a single 20-card deck.',    25, 'forest'),
  ('hundred-correct',      'Aldarafmæli',      'Answer 100 cards correctly across all decks.',       30, 'synthwave'),
  ('all-word-types-one-deck', 'Málfræðingur',  'Study all 7 word types in a single deck.',           15, null),
  ('five-words-strong',    'Traust orð',       'Mark 5 vocab words as Strong.',                      10, null),
  ('vocab-list-25',        'Orðasafnari',      'Add 25 words to your vocab list.',                   10, null),
  ('night-owl',            'Náttugla',         'Complete a deck between midnight and 4am.',          10, null),
  ('missed-words-cleared', 'Hreinsað borð',    'Get a perfect score on an "Only Missed Words" deck.', 15, null);
