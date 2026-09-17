# LexPlain — Interactive Bare Act Reader & Statutory Inspector

## 1. Overview
LexPlain is an interactive digital reader for legislative statutes (Bare Acts). It bridges formal statutory drafting and lay understanding by rendering Bare Acts in an authentic Gazette/print paper canvas while integrating proactive AI aids:
- **Interactive Glossary Tooltips:** Difficult or archaic legal terms are underlined; hovering displays instant layman explanations.
- **Section Inspector:** Clicking any section opens a slide-over panel deconstructing the provision into Plain English Summary, Essential Ingredients, Provisos & Exceptions, and How to Read this Section.

## 2. Tech Stack
- Frontend: React 19, Vite, TypeScript, Tailwind CSS v4 (Vite plugin), Radix UI (`@radix-ui/react-tooltip`, `@radix-ui/react-dialog`), Lucide Icons.
- Backend / ingestion: Python 3.11+, Anthropic Python SDK (`claude-sonnet-4-6`), Pydantic v2.
- Storage / state: local JSON data contract (`src/data/act_data.json`), client state via React Context (`src/state/SectionContext.tsx`).

## 3. Data Contract
See `src/types/act.ts` — `BareActDocument`, `ActSection`, `SectionBreakdown`, `GlossaryEntry`. This is the single source of truth for both the frontend and the Python ingestion script's JSON output.

## 4. Design Tokens
- Canvas background: `#FDFBF7`
- Body font: Lora / Merriweather, 16px, line-height 1.8, justified
- Inspector font: Inter / system sans-serif
- Active section indicator: left border `4px solid #D97706` (amber-600), highlight `rgba(245,158,11,0.05)`
- Glossary underline: dotted amber, `border-b-2 border-dotted border-amber-500 cursor-help`

## 5. Components
- `Navbar.tsx` — search, act title, PDF upload trigger (visual stub only, no parsing pipeline).
- `BareActCanvas.tsx` — statutory canvas; maps sections; `j`/`k`/arrow-key navigation between sections.
- `SectionBlock.tsx` — single section; tokenizes `raw_text` against the glossary via `src/utils/textParser.tsx`.
- `GlossaryWord.tsx` — Radix Tooltip-based glossary term.
- `SectionInspector.tsx` — right-hand slide-over analytical panel.

## 6. Ingestion Pipeline
`scripts/parse_act.py` converts a plain-text Bare Act (`scripts/sample_act.txt`) into `BareActDocument`-shaped JSON using Claude tool calling. Requires Python 3.11+, `pip install anthropic pydantic`, and `ANTHROPIC_API_KEY`. Not run as part of the initial build — `src/data/act_data.json` was hand-authored for Sections 10–12 of the Indian Contract Act, 1872 to unblock frontend development independent of the Python environment.

## 7. Out of scope (current pass)
- PDF upload parsing (UI stub only).
- Multi-act switching (single static act loaded).
- Live execution of the ingestion script.
