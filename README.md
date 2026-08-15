# Icelandic Flashcards

A mobile-first web app for studying Icelandic vocabulary, built with React, TypeScript, and Supabase, deployed on Vercel.

See [CLAUDE.md](./CLAUDE.md) for the detailed engineering rules (TypeScript strictness, linting, testing, mobile-first requirements, etc.) that this project follows. This README is the quick-start / orientation doc; CLAUDE.md is the rulebook.

## Getting started

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase project's URL and anon key (Supabase dashboard → Project Settings → API):
   ```
   cp .env.example .env.local
   ```
3. Apply the database schema. There's no Supabase CLI wired up for this project — instead, open your Supabase project's **SQL Editor** (dashboard → SQL Editor → New query) and run each file in `supabase/migrations/` in filename order (they're numbered). This creates `profiles`, `vocab_list`, `points_transactions`, `achievements`, `user_achievements`, and enables Row Level Security with owner-only policies on all of them.
4. In the dashboard, go to **Authentication → Providers → Email** and turn **off** "Confirm email" for local development — otherwise a new signup can't be used until it's confirmed via a real email link. Turn it back on before any real users sign up.
5. Start the dev server:
   ```
   npm run dev
   ```

Other scripts:

| Command                           | What it does                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `npm run build`                   | Type-checks (`tsc -b`) and produces a production build — this is what Vercel runs |
| `npm run lint`                    | ESLint                                                                            |
| `npm run typecheck`               | TypeScript only, no build output                                                  |
| `npm test`                        | Runs the Vitest suite once                                                        |
| `npm run test:watch`              | Vitest in watch mode                                                              |
| `npm run format` / `format:check` | Prettier write / check                                                            |

A Husky pre-commit hook runs `lint-staged` (ESLint + Prettier) on staged files automatically — you shouldn't need to run lint/format manually before committing.

## Architecture overview

Folder structure follows [bulletproof-react](https://github.com/alan2207/bulletproof-react):

```
src/
├─ app/            # root App component, providers, router config, routes
├─ assets/         # static images, fonts
├─ components/     # shared UI components used by more than one feature
├─ config/         # env var access (src/config/env.ts)
├─ features/       # feature modules — most app code lives here
├─ hooks/          # shared hooks used by more than one feature
├─ lib/            # thin wrappers around third-party libs (e.g. the Supabase client)
├─ stores/         # global state (React Context + useReducer)
├─ testing/        # test setup/utilities
├─ types/          # shared TypeScript types
└─ utils/          # pure utility functions
```

Key decisions (see CLAUDE.md for the full rationale):

- **Routing:** React Router, routes defined in `app/routes/`. `/login` and `/signup` are public; everything else nests under `app/routes/layout.tsx`, which wraps `RequireAuth` and renders the shared header (logo, theme picker, log out).
- **Data fetching:** TanStack Query wraps every Supabase call — see `src/lib/supabase.ts` for the client. `src/features/word-generation/` is the pattern to follow for calling external (non-Supabase) APIs.
- **Global state:** React Context + `useReducer`, kept minimal — auth session (`src/stores/auth-context.ts`), the active study session/deck (`src/stores/study-session-context.ts`), and theme (`src/stores/theme-context.ts`).
- **Styling:** Tailwind v4 + DaisyUI, configured in `src/index.css`. Multiple DaisyUI themes are enabled (light, dark, cupcake, forest, synthwave) and user-selectable via the theme picker in the header; the choice persists to `localStorage` and defaults to the OS `prefers-color-scheme`. (Theme _unlocking_ via achievements isn't wired up yet — all themes are currently selectable by everyone.)
- **Path alias:** import shared code as `@/...` (e.g. `@/lib/supabase`) instead of relative `../../..` chains.

### How a word becomes a flashcard

`src/features/word-generation/` is the core data pipeline, used by `deck-builder` to build decks:

1. `faker.word.<type>()` picks a random English word of the requested type (noun/adjective/adverb/verb/conjunction/preposition/interjection).
2. The `translate` package translates it to Icelandic.
3. The Icelandic word is looked up against **[BÍN](https://bin.arnastofnun.is/)** (Beygingarlýsing íslensks nútímamáls — the Árni Magnússon Institute's official Icelandic inflection database), via the hosted wrapper at [ylhyra.is/api/inflection](https://github.com/ylhyra/icelandic-inflections). This returns the word's full inflection paradigm (case, gender, tense, person, degree, etc.), not just a definition.
4. If no entry of the requested word type is found, steps 1–3 retry with a fresh random word (up to 8 attempts) — not every random word has a usable Icelandic entry.
5. `formsToTable()` (also in `word-generation`) turns the raw inflection forms into a `GrammarTable` — a hand-written mapping per word type (verb conjugation, noun/adjective declension, adverb degree), since the real shape differs enough per type that a generic auto-layout isn't a good fit. This is what renders as the flip-side grammar table in `study-session`.

BÍN's data is licensed **CC BY-SA 4.0** (© Árni Magnússon Institute for Icelandic Studies) — attributed in the app footer. It does not include English translations, which is why `translate` is still needed as a separate step.

## Known issues / gotchas

- The Vercel build environment's Node version target is `^20.19.0 || ^22.13.0 || >=24`; local dev has occasionally shown an `EBADENGINE` warning on Node 22.12 during `npm install`. It hasn't caused real problems, but if you hit a dependency issue locally, check your Node version first.
- `word-generation` calls two free, keyless public APIs (`translate` and `ylhyra.is`) with no rate-limit handling beyond a small bounded concurrency (3 cards generate at a time, not all 20 at once) during deck generation. Fine for the current scale; if it ever proves unreliable, the plan is a server-side proxy (Supabase Edge Function), not a client-side workaround.
- The verb conjugation table only covers the indicative mood, active voice (matching the app's grammar-table reference mockup) — subjunctive, imperative, and reflexive/middle-voice forms are intentionally left out.
- Achievements and points spending (a future store) aren't built yet — `points_transactions` rows are recorded on real deck completion (not single-word reviews) and `profiles.points_balance` updates automatically, but there's no UI surfacing achievements or a store.
- Clicking a word (from the vocab list, or a completed deck's results screen) opens a lightweight single-card review via `useStartSingleCardStudy` (`features/study-session`) — it reuses the same `/study` flow but is flagged `isReview` so it skips points recording and the full results screen (Retry/New-Deck/Only-Missed don't make sense for one card).
- `supabase/migrations/` holds the SQL schema (profiles, vocab_list, points_transactions, achievements, user_achievements — all RLS-enabled) but there's no Supabase CLI project linked, so migrations aren't applied automatically. Run them by hand via the dashboard's SQL Editor, in filename order, whenever a new one is added — see step 3 above.
- `mockups/wire_frames/` holds the design wireframes referenced during planning.
