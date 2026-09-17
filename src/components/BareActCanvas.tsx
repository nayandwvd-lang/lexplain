import { useEffect } from "react";
import type { BareActDocument } from "../types/act";
import SectionBlock from "./SectionBlock";
import { useSectionContext } from "../state/SectionContext";

interface BareActCanvasProps {
  actData: BareActDocument;
  sections: BareActDocument["sections"];
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export default function BareActCanvas({ actData, sections }: BareActCanvasProps) {
  const { activeSection, setActiveSection } = useSectionContext();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      if (sections.length === 0) return;

      const isNext = e.key === "j" || e.key === "ArrowDown";
      const isPrev = e.key === "k" || e.key === "ArrowUp";
      if (!isNext && !isPrev) return;

      e.preventDefault();
      const currentIndex = sections.findIndex((s) => s.number === activeSection);
      let nextIndex: number;
      if (currentIndex === -1) {
        nextIndex = 0;
      } else {
        const delta = isNext ? 1 : -1;
        nextIndex = Math.min(Math.max(currentIndex + delta, 0), sections.length - 1);
      }

      const nextSection = sections[nextIndex];
      setActiveSection(nextSection.number);
      document
        .getElementById(`sec-${nextSection.number}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sections, activeSection, setActiveSection]);

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <header className="text-center mb-10 pb-8 border-b border-stone-300">
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">
            {actData.act_title}
          </h1>
          <p className="font-serif text-sm text-stone-500 mb-4">{actData.act_number}</p>
          {actData.enactment_date && (
            <p className="font-serif text-xs text-stone-400 mb-4">
              Enacted {actData.enactment_date}
            </p>
          )}
          {actData.preamble && (
            <p className="font-serif text-sm leading-[1.8] text-stone-700 text-justify italic">
              {actData.preamble}
            </p>
          )}
        </header>

        {sections.length === 0 ? (
          <p className="font-sans text-center text-stone-400 py-10">No sections match your search.</p>
        ) : (
          sections.map((section) => (
            <SectionBlock
              key={section.number}
              section={section}
              glossary={actData.glossary}
              isActive={activeSection === section.number}
              onSelect={setActiveSection}
            />
          ))
        )}
      </div>
    </div>
  );
}
