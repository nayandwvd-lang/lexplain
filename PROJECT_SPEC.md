# LexPlain — Interactive Bare Act Reader & Statutory Inspector

## 1. Overview
LexPlain is an interactive digital reader for legislative statutes (Bare Acts). It bridges formal statutory drafting and lay understanding by rendering Bare Acts in an authentic Gazette/print paper canvas while integrating proactive AI aids:
- **Interactive Glossary Tooltips:** Difficult or archaic legal terms are underlined; hovering displays instant layman explanations.
- **Section Inspector:** Clicking any section opens a slide-over panel deconstructing the provision into Plain English Summary, Essential Ingredients, Provisos & Exceptions, and How to Read this Section.

## 2. Tech Stack
- Frontend: React 19, Vite, TypeScript, Tailwind CSS v4 (Vite plugin), Radix UI (`@radix-ui/react-tooltip`, `@radix-ui/react-dialog`), Lucide Icons, React Router (`react-router-dom`).
- Backend / ingestion: Python 3.11+, Anthropic Python SDK (`claude-sonnet-4-6`), Pydantic v2.
- Storage / state: one JSON file per act at `src/data/acts/<slug>.json` (data contract), discovered at build time by `src/data/actRegistry.ts`; client state via React Context (`src/state/SectionContext.tsx`), mounted per-act.

## 3. Data Contract
See `src/types/act.ts` — `BareActDocument`, `ActSection`, `SectionBreakdown`, `GlossaryEntry`, `ActSummary`. This is the single source of truth for both the frontend and the Python ingestion script's JSON output.

Acts are stored one-per-file at `src/data/acts/<slug>.json`. The filename (minus `.json`) is the canonical slug, used both by `actRegistry.ts` (via `import.meta.glob('/src/data/acts/*.json', { eager: true })`) and as the `/acts/:slug` route param — there is no separate manifest file to keep in sync. `actRegistry.ts` exports `actsBySlug`, `actSummaries` (for the Library page), and `getActBySlug(slug)`.

## 4. Design Tokens
- Canvas background: `#FDFBF7`
- Body font: Lora / Merriweather, 16px, line-height 1.8, justified
- Inspector font: Inter / system sans-serif
- Active section indicator: left border `4px solid #D97706` (amber-600), highlight `rgba(245,158,11,0.05)`
- Glossary underline: dotted amber, `border-b-2 border-dotted border-amber-500 cursor-help`

## 5. Components
- `App.tsx` — route table only (`Tooltip.Provider` + `Routes`): `/` → `Library`, `/acts/:slug` → `ActReaderPage`, `*` → `NotFound`.
- `pages/Library.tsx` — home page; act picker cards (title, act number, enactment date, section count, preamble blurb) sourced from `actSummaries`, linking to `/acts/:slug`.
- `pages/ActReaderPage.tsx` — resolves `:slug` via `getActBySlug`, renders `NotFound` if unresolved, otherwise mounts the reader inside `<SectionProvider key={slug}>` (so switching acts resets `activeSection` and local search state).
- `pages/NotFound.tsx` — shared 404 for unmatched routes and unresolved act slugs.
- `Navbar.tsx` — search, act title (logo links back to `/`), PDF upload trigger (visual stub only, no parsing pipeline).
- `BareActCanvas.tsx` — statutory canvas; maps sections; `j`/`k`/arrow-key navigation between sections.
- `SectionBlock.tsx` — single section; tokenizes `raw_text` against the glossary via `src/utils/textParser.tsx`.
- `GlossaryWord.tsx` — Radix Tooltip-based glossary term.
- `SectionInspector.tsx` — right-hand slide-over analytical panel.

## 6. Ingestion Pipeline
`scripts/parse_act.py` converts a plain-text Bare Act into `BareActDocument`-shaped JSON using Claude tool calling. Requires Python 3.11+, `pip install anthropic pydantic`, and `ANTHROPIC_API_KEY`. Takes a required `--slug`; output defaults to `src/data/acts/<slug>.json` (overridable via `-o/--output`), which is what makes a newly-ingested act show up on the Library page and become routable at `/acts/<slug>` with no further wiring. A local `.venv` (gitignored) with the deps installed is present in the repo, but the script has not yet been executed against a live API key/real act content — `src/data/acts/indian-contract-act-1872.json` (Sections 10–12) was hand-authored to unblock frontend development independent of the Python environment.

## 7. Deployment
Live at **https://lexplain-eight.vercel.app**. Deployed to Vercel, project `lexplain` (team `nayan-dwivedi`), linked to GitHub repo `nayandwvd-lang/lexplain` for git-based deploys. `vercel.json` sets `buildCommand`/`outputDirectory` and a catch-all SPA rewrite (`/(.*) → /index.html`) so direct/refreshed loads of `/acts/:slug` resolve client-side instead of 404ing on Vercel's static hosting.

## 8. Out of scope (current pass)
- PDF upload parsing (UI stub only).
- Live execution of the ingestion script against real, new act content (env is ready; not yet run with a real API key).
