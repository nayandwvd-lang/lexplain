import { useRef } from "react";
import type { PointerEvent } from "react";
import type { ActSection } from "../types/act";
import { tokenizeWithGlossary } from "../utils/textParser";
import { sectionLabel } from "../utils/sectionLabel";

interface SectionBlockProps {
  section: ActSection;
  glossary: Record<string, string>;
  isActive: boolean;
  onSelect: (sectionNumber: string) => void;
}

// How long a second tap has to land within, to count as a "double tap",
// on touch devices.
const DOUBLE_TAP_WINDOW_MS = 400;

export default function SectionBlock({
  section,
  glossary,
  isActive,
  onSelect,
}: SectionBlockProps) {
  const lastTapRef = useRef(0);

  function handlePointerUp(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "touch") {
      // Mouse/pen: a single click opens the inspector, same as before.
      onSelect(section.number);
      return;
    }
    // Touch has no hover, so a single tap is reserved for glossary-word
    // lookups (see GlossaryWord.tsx). Opening the inspector here instead
    // needs a deliberate second tap within the window below.
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_WINDOW_MS) {
      lastTapRef.current = 0;
      onSelect(section.number);
    } else {
      lastTapRef.current = now;
    }
  }

  return (
    <section
      id={`sec-${section.number}`}
      onPointerUp={handlePointerUp}
      className={`cursor-pointer touch-manipulation px-6 py-5 mb-4 transition-colors border-l-4 ${
        isActive ? "border-amber-600 bg-amber-500/5" : "border-transparent hover:bg-stone-50"
      }`}
    >
      <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-amber-700 mb-1">
        {sectionLabel(section.number)}
      </h3>
      <h2 className="font-serif text-xl font-semibold text-stone-900 mb-3">
        {section.title}
      </h2>
      <p className="font-serif text-base leading-[1.8] text-justify text-stone-800 whitespace-pre-line">
        {tokenizeWithGlossary(section.raw_text, glossary)}
      </p>
    </section>
  );
}
