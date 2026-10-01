import { X, CheckCircle2, AlertTriangle, BookOpen, MessageSquareText, Languages } from "lucide-react";
import type { ActSection } from "../types/act";
import { useLanguage } from "../state/LanguageContext";

interface SectionInspectorProps {
  section: ActSection | null;
  onClose: () => void;
}

export default function SectionInspector({ section, onClose }: SectionInspectorProps) {
  const isOpen = section !== null;
  const { language, setLanguage } = useLanguage();

  // Hindi translations are added incrementally, section by section — fall
  // back to English (and flag it) wherever a Hindi field is missing/empty.
  const hasHindi = Boolean(
    section?.breakdown.plain_summary_hi &&
      section?.breakdown.essential_elements_hi?.length &&
      section?.breakdown.exceptions_and_qualifications_hi &&
      section?.breakdown.how_to_read_hi
  );
  const showHindi = language === "hi" && hasHindi;

  const plainSummary = showHindi ? section!.breakdown.plain_summary_hi! : section?.breakdown.plain_summary;
  const essentialElements = showHindi
    ? section!.breakdown.essential_elements_hi!
    : section?.breakdown.essential_elements ?? [];
  const exceptions = showHindi
    ? section!.breakdown.exceptions_and_qualifications_hi!
    : section?.breakdown.exceptions_and_qualifications ?? [];
  const howToRead = showHindi ? section!.breakdown.how_to_read_hi! : section?.breakdown.how_to_read;

  return (
    <aside
      className={`font-sans fixed top-[59px] right-0 h-[calc(100vh-59px)] w-full sm:w-[420px] lg:w-[35%] bg-white border-l border-stone-200 shadow-2xl transition-transform duration-300 z-30 overflow-y-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {section && (
        <div className="p-6">
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-stone-200">
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

          <div className="mb-5 flex items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Explanation language"
              className="inline-flex rounded-full border border-stone-200 bg-stone-100 p-0.5 text-xs font-semibold"
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
                  language === "en" ? "bg-white text-amber-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                aria-pressed={language === "hi"}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  language === "hi" ? "bg-white text-amber-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                हिंदी
              </button>
            </div>
            {language === "hi" && !hasHindi && (
              <p className="text-xs text-stone-400 text-right">
                इस खंड के लिए हिंदी अनुवाद अभी उपलब्ध नहीं — अंग्रेज़ी दिखाई जा रही है
              </p>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-2">
                <MessageSquareText className="w-4 h-4" />
                {showHindi ? "सरल भाषा में सारांश" : "Plain English Summary"}
              </h3>
              <p className="text-sm leading-relaxed text-stone-700">{plainSummary}</p>
            </div>

            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {showHindi ? "आवश्यक तत्व" : "Essential Elements"}
              </h3>
              <ul className="space-y-2">
                {essentialElements.map((item, i) => (
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
                {showHindi ? "अपवाद एवं शर्तें" : "Exceptions & Provisos"}
              </h3>
              <ul className="space-y-2">
                {exceptions.map((item, i) => (
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
                {showHindi ? "इस धारा को कैसे समझें" : "How to Read This Section"}
              </h3>
              <p className="text-sm leading-relaxed text-stone-700">{howToRead}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
