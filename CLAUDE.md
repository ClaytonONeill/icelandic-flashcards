# CLAUDE.md

Guidance for Claude Code (and any engineer, human or AI) working in this repository.

## Project

Icelandic Flashcards — a mobile-first study app for learning Icelandic vocabulary, built on React + TypeScript + Supabase, deployed on Vercel.

## Engineering philosophy

Write this codebase as a **senior engineer optimizing for a junior engineer's ability to pick it up cold**, not for your own cleverness.

- **Boring and explicit beats clever and abstract.** Prefer a plain function over a factory, a plain component over a generic wrapper, a `switch` over a strategy-pattern registry.
- **Do not overengineer.** This is a flashcard app, not a platform. Don't add configuration layers, plugin systems, generic "framework" code, or abstractions for requirements that don't exist yet. Three similar components are better than a premature shared abstraction.
- **Every non-obvious decision gets written down.** If you chose a pattern for a reason that isn't obvious from reading the code, it belongs in this file or the README — not just in your head or a PR description.
- **Optimize for onboarding time.** A new contributor should be able to read the README, skim this file, and start shipping a feature within an hour without needing a synchronous walkthrough.

## Tech stack

| Layer                        | Choice                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Framework                    | React 19 + TypeScript, Vite                                                      |
| Backend                      | Supabase (Postgres, Auth, Storage)                                               |
| Styling                      | Tailwind CSS v4 + DaisyUI                                                        |
| Routing                      | React Router                                                                     |
| Server state / data fetching | TanStack Query (`@tanstack/react-query`), wrapping `@supabase/supabase-js` calls |
| Global client state          | React Context + `useReducer`                                                     |
| Testing                      | Vitest + React Testing Library                                                   |
| Deployment                   | Vercel                                                                           |
| Git hooks                    | Husky + lint-staged (ESLint + Prettier on staged files)                          |

Don't introduce a new library into any of these slots (a second router, Redux, a second data-fetching layer, etc.) without updating this table and explaining why in the PR — the point of this table is that there is exactly one accepted way to do each of these things.

## Project structure

Follows the [bulletproof-react](https://github.com/alan2207/bulletproof-react) layout. Everything lives under `src/`:

```
src/
├─ app/            # routes, root App component, providers, router config
│  ├─ routes/
│  ├─ app.tsx
│  ├─ provider.tsx # wraps app in QueryClientProvider, theme/state contexts, router
│  └─ router.tsx
├─ assets/         # static images, fonts, etc.
├─ components/     # shared, feature-agnostic UI components (Button, Card, ThemePicker...)
├─ config/         # env var exports, app-wide constants
├─ features/       # feature modules (see below) — most code lives here
├─ hooks/          # shared hooks used across multiple features
├─ lib/            # thin, preconfigured wrappers around third-party libs (e.g. the Supabase client)
├─ stores/         # global state (React Context + useReducer providers)
├─ testing/         # test utilities, mocks, test setup
├─ types/          # shared TypeScript types
└─ utils/          # pure utility functions
```

Each feature under `features/<feature-name>/` is self-contained and internally follows the same shape as needed:

```
features/study-session/
├─ components/   # components used only within this feature
├─ hooks/        # hooks used only within this feature (e.g. useDeckQuery)
├─ api/          # TanStack Query hooks/functions that call Supabase for this feature
├─ types/        # types scoped to this feature
└─ index.ts      # public exports — only import from a feature via this file
```

**Rule:** code only moves "up" from `features/*` into `components/`, `hooks/`, `utils/`, etc. once a second feature actually needs it. Don't pre-emptively shove things into the shared folders.

**Rule:** features do not import from each other's internals — only from another feature's `index.ts`. If two features need to share logic, that logic belongs in a shared folder, not in a cross-feature import.

## Architecture decisions

These are settled choices for this project. Don't relitigate them per-feature — if one genuinely doesn't fit, raise it and update this doc, don't silently deviate.

- **Routing — React Router.** Routes live in `app/routes/` and are wired up in `app/router.tsx`. Even simple screens (home, study session, results) get a real route so they're deep-linkable and the browser back button works — expected on mobile.
- **Data fetching — TanStack Query over Supabase.** Every Supabase read/write goes through a `useQuery`/`useMutation` hook in the relevant feature's `api/` folder, never called directly from a component. This gives consistent loading/error states and cache invalidation for free. The Supabase client itself is instantiated once in `lib/supabase.ts` and imported from there — never re-instantiated elsewhere.
- **Global state — React Context + `useReducer`.** Used sparingly, for genuinely cross-cutting state (active theme, in-progress study session). Anything that's really just server data belongs in TanStack Query, not in a store. If Context re-render cost ever becomes a measured problem, that's when to revisit — not before.
- **Theming — DaisyUI, multiple selectable themes.** Theme list is defined in `tailwind.config`/DaisyUI config; the active theme is applied via `data-theme` on `<html>`, chosen through a `ThemeContext` in `stores/`, and persisted to `localStorage`. Default should respect `prefers-color-scheme` on first load.

## TypeScript & linting

`tsconfig.app.json` enforces (add any missing ones — see "Setup status" below):

```jsonc
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"erasableSyntaxOnly": true,
"noFallthroughCasesInSwitch": true,
"noUncheckedSideEffectImports": true
```

These exist to catch problems locally that would otherwise surface as a **failed Vercel build**. Don't loosen them to make a red squiggly go away — fix the underlying type issue.

- No `any` — if the type is genuinely unknown, use `unknown` and narrow it.
- No `// eslint-disable` or `// @ts-ignore` without a comment explaining why it's safe. Prefer fixing the root cause.
- ESLint config (`eslint.config.js`) is the source of truth for style/correctness rules beyond the compiler.

### Pre-commit (Husky + lint-staged)

A `pre-commit` hook runs `lint-staged`, which runs ESLint and Prettier against staged files only. A commit should never land with lint errors — if the hook blocks you, fix the issue, don't bypass it with `--no-verify`.

Because `noUnusedLocals`/`noUnusedParameters`/etc. only run on full `tsc -b`, also run `npm run build` before opening a PR — lint-staged alone won't catch every type error that would break the Vercel build.

## Mobile-first design

This app is primarily used on a phone. Design and build for a small viewport first, then expand up — not the reverse.

- Use Tailwind's mobile-first breakpoints (unprefixed = mobile, then `sm:`/`md:`/`lg:` layer up).
- Touch targets should be comfortably tappable (DaisyUI defaults are generally fine — don't shrink padding on buttons/inputs below their default sizing).
- **Every UI change gets checked at a mobile viewport width before it's considered done** — browser dev tools device toolbar at minimum, a real device when the change is layout-significant. Don't rely on desktop-width review alone.
- Avoid fixed pixel widths/heights on layout containers; prefer flex/grid with relative sizing so components hold up across device sizes.

## Testing

Vitest + React Testing Library, test utilities/mocks in `src/testing/`.

- Test behavior (what the user sees/does), not implementation details.
- Feature logic that isn't trivial (scoring, spaced-repetition scheduling, deck shuffling, etc.) should have unit tests. Simple presentational components generally don't need dedicated tests.
- Don't chase 100% coverage — this is a small app; test the things that would actually break silently.

## README maintenance

`README.md` is the front door for a new contributor and must be kept current as the project evolves — treat an out-of-date README as a bug. It should cover:

1. **What the app is and does** (short, non-technical enough for anyone to follow).
2. **How to run it locally** (env vars needed, dev server command, Supabase project setup).
3. **Architecture overview** — pointer to this file for detailed rules, plus a plain-English summary of the folder structure and the decisions in the table above.
4. **Known issues / gotchas** — anything a new contributor would otherwise burn an hour rediscovering (e.g. "Supabase RLS policy X blocks Y until you've done Z", flaky behavior, deliberate half-finished features).

Update the README in the same PR that introduces the change it describes — don't let it drift and try to reconcile it later.

## Deployment (Vercel)

- Build must pass `npm run build` (`tsc -b && vite build`) cleanly — this is exactly what Vercel runs.
- Supabase credentials are supplied via Vercel env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), read through `config/`, never hardcoded or committed.
- Do not commit `.env*` files — confirm they're covered by `.gitignore` before adding new env vars.
