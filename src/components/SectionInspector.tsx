import { X, CheckCircle2, AlertTriangle, BookOpen, MessageSquareText } from "lucide-react";
import type { ActSection } from "../types/act";

interface SectionInspectorProps {
  section: ActSection | null;
  onClose: () => void;
}

export default function SectionInspector({ section, onClose }: SectionInspectorProps) {
  const isOpen = section !== null;

  return (
    <aside
      className={`font-sans fixed top-[59px] right-0 h-[calc(100vh-59px)] w-full sm:w-[420px] lg:w-[35%] bg-white border-l border-stone-200 shadow-2xl transition-transform duration-300 z-30 overflow-y-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {section && (
        <div className="p-6">
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-stone-200">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">
                Section {section.number}
              </p>
              <h2 className="text-lg font-semibold text-stone-900">{section.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close inspector"
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-2">
                <MessageSquareText className="w-4 h-4" />
                Plain English Summary
              </h3>
              <p className="text-sm leading-relaxed text-stone-700">
                {section.breakdown.plain_summary}
              </p>
            </div>

            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Essential Elements
              </h3>
              <ul className="space-y-2">
                {section.breakdown.essential_elements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-red-800 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Exceptions &amp; Provisos
              </h3>
              <ul className="space-y-2">
                {section.breakdown.exceptions_and_qualifications.map((item, i) => (
                  <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                    <span className="text-red-400 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-800 mb-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                How to Read This Section
              </h3>
              <p className="text-sm leading-relaxed text-stone-700">
                {section.breakdown.how_to_read}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
