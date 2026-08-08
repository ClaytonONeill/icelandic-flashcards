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
3. Start the dev server:
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

- **Routing:** React Router, routes defined in `app/routes/`.
- **Data fetching:** TanStack Query wraps every Supabase call — see `src/lib/supabase.ts` for the client and `src/features/word-lookup/api/use-random-word.ts` for the pattern to follow.
- **Global state:** React Context + `useReducer`, kept minimal (e.g. `src/stores/theme-context.ts` + `theme-provider.tsx`).
- **Styling:** Tailwind v4 + DaisyUI, configured in `src/index.css`. Multiple DaisyUI themes are enabled (light, dark, cupcake, forest, synthwave) and user-selectable via the theme picker in the header; the choice persists to `localStorage` and defaults to the OS `prefers-color-scheme`.
- **Path alias:** import shared code as `@/...` (e.g. `@/lib/supabase`) instead of relative `../../..` chains.

### Example feature: `word-lookup`

`src/features/word-lookup/` is a working example of the intended feature shape (`api/`, `components/`, `index.ts`) — it's a demo that picks a random English word, translates it, and looks it up in a dictionary API via a TanStack Query hook. It doesn't call Supabase (it's not app data), but every real flashcard feature (decks, cards, study sessions) should follow the same shape, swapping the `api/` layer for calls into `src/lib/supabase.ts`.

## Known issues / gotchas

- The Vercel build environment's Node version target is `^20.19.0 || ^22.13.0 || >=24`; local dev has occasionally shown an `EBADENGINE` warning on Node 22.12 during `npm install`. It hasn't caused real problems, but if you hit a dependency issue locally, check your Node version first.
- `word-lookup` calls two free public APIs (a translate service and `freedictionaryapi.com`) with no API key and no rate-limit handling — fine for a demo, not production-grade. Don't copy its error handling as-is for real data fetching; it's intentionally minimal.
- No authentication is wired up yet. When it is, document the auth flow here.
- `mockups/wire_frames/` (not yet committed as of this writing) holds the design wireframes referenced during planning.
