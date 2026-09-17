# LexPlain — Claude Code Context

Interactive Bare Act reader/library: React 19 + Vite + TypeScript + Tailwind v4 (Vite plugin, no `tailwind.config.js`) + Radix UI + Lucide + React Router. See `PROJECT_SPEC.md` for the full spec.

## Data contract
`src/types/act.ts` (`BareActDocument`) is the single source of truth. Every file in `src/data/acts/*.json` and `scripts/parse_act.py`'s output must always validate against it — if you change the schema, update both.

Acts live one-per-file at `src/data/acts/<slug>.json`. The filename (minus `.json`) *is* the slug *is* the `/acts/:slug` URL segment — there is no separate manifest. `src/data/actRegistry.ts` discovers all acts at build time via `import.meta.glob`; dropping a new correctly-shaped JSON file into `src/data/acts/` is sufficient for it to appear on the Library page and become routable, no other wiring needed.

### How to add a new act
1. `cd "/Users/nayandwivedi/Downloads/bare actr" && source .venv/bin/activate` (Python 3.11 venv with `anthropic`+`pydantic`, already set up).
2. Have the act's plain text in a `.txt` file and `ANTHROPIC_API_KEY` set in the environment.
3. Run `python scripts/parse_act.py --input <file> --slug <kebab-case-slug> --act-title "<title>" --act-number "<number>" [--enactment-date "<date>"] [--preamble "<text>"]`. Output defaults to `src/data/acts/<slug>.json`.
4. Confirm the output validates against `BareActDocument`, then `deactivate` and rebuild — the Library page picks up the new act automatically.

## Known constraints
- Do not hardcode outdated Claude model ids in `scripts/parse_act.py` — it currently targets `claude-sonnet-4-6`; check the `claude-api` skill for the current model before changing it.
- The Navbar's PDF upload button is a visual stub (disabled) — no parsing pipeline is wired up. Don't assume it works.
- `parse_act.py` requires Python 3.11+, `pip install anthropic pydantic`, and `ANTHROPIC_API_KEY`. The local `.venv` (gitignored) has the deps installed, but the script has not been executed against a live API key in this repo yet.
- State management uses React Context (`src/state/SectionContext.tsx`) for the single active-section value, mounted per-act via `<SectionProvider key={slug}>` in `ActReaderPage.tsx` so switching acts resets it — don't introduce Zustand/Redux unless the state surface genuinely grows further.
- Routing: `/` is `pages/Library.tsx` (act picker), `/acts/:slug` is `pages/ActReaderPage.tsx` (the reader), unmatched routes and unresolved slugs both render `pages/NotFound.tsx`. `App.tsx` is just the route table.
- Deployed to Vercel (project `lexplain`, linked to `nayandwvd-lang/lexplain`); `vercel.json` has a catch-all SPA rewrite to `index.html` so deep links to `/acts/:slug` don't 404 on refresh.

## Design tokens
Canvas `#FDFBF7`, active border `#D97706` (amber-600) at 4px left, glossary underline dotted amber. Reading font Lora/Merriweather (serif), inspector font Inter (sans).

Note: the unrelated `/Users/nayandwivedi/Downloads/CLAUDE.md` one directory up governs a different project (a CPC VitePress guide) and has no bearing on this repo.
