import type { ActSection } from "../types/act";
import { tokenizeWithGlossary } from "../utils/textParser";

interface SectionBlockProps {
  section: ActSection;
  glossary: Record<string, string>;
  isActive: boolean;
  onSelect: (sectionNumber: string) => void;
}

export default function SectionBlock({
  section,
  glossary,
  isActive,
  onSelect,
}: SectionBlockProps) {
  return (
    <section
      id={`sec-${section.number}`}
      onClick={() => onSelect(section.number)}
      className={`cursor-pointer px-6 py-5 mb-4 transition-colors border-l-4 ${
        isActive ? "border-amber-600 bg-amber-500/5" : "border-transparent hover:bg-stone-50"
      }`}
    >
      <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-amber-700 mb-1">
        Section {section.number}
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
