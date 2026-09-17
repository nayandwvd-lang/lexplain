# LexPlain — Claude Code Context

Interactive Bare Act reader: React 19 + Vite + TypeScript + Tailwind v4 (Vite plugin, no `tailwind.config.js`) + Radix UI + Lucide. See `PROJECT_SPEC.md` for the full spec.

## Data contract
`src/types/act.ts` (`BareActDocument`) is the single source of truth. `src/data/act_data.json` and `scripts/parse_act.py`'s output must always validate against it — if you change the schema, update both.

## Known constraints
- Do not hardcode outdated Claude model ids in `scripts/parse_act.py` — it currently targets `claude-sonnet-4-6`; check the `claude-api` skill for the current model before changing it.
- The Navbar's PDF upload button is a visual stub (disabled) — no parsing pipeline is wired up. Don't assume it works.
- `parse_act.py` requires Python 3.11+, `pip install anthropic pydantic`, and `ANTHROPIC_API_KEY`. It has not been executed against a live API key in this repo yet.
- State management uses React Context (`src/state/SectionContext.tsx`) for the single active-section value — don't introduce Zustand/Redux unless the state surface genuinely grows (multi-act, persisted UI state, complex cross-component filters).

## Design tokens
Canvas `#FDFBF7`, active border `#D97706` (amber-600) at 4px left, glossary underline dotted amber. Reading font Lora/Merriweather (serif), inspector font Inter (sans).

Note: the unrelated `/Users/nayandwivedi/Downloads/CLAUDE.md` one directory up governs a different project (a CPC VitePress guide) and has no bearing on this repo.
