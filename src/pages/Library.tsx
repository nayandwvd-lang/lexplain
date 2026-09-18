import { Link } from "react-router-dom";
import { ScrollText, MessageSquarePlus } from "lucide-react";
import { actSummaries } from "../data/actRegistry";

const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScGjthU229w2wfjJbgr7uvcSM3dMaCV2JyS4BkrYRr95Nqrpw/viewform";

export default function Library() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <header className="font-sans flex items-center justify-between gap-2 border-b border-stone-200 bg-white/90 backdrop-blur px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-stone-800">LexPlain</span>
        </div>
        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-amber-700 border border-amber-200 bg-amber-50 rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-amber-100 transition shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span className="hidden sm:inline">Feedback</span>
        </a>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-serif text-2xl font-bold text-stone-900 mb-1">Bare Act Library</h1>
        <p className="text-sm text-stone-500 mb-8">
          Select an Act to read it with plain-English explanations and a glossary of legal terms.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actSummaries.map((act) => (
            <Link
              key={act.slug}
              to={`/acts/${act.slug}`}
              className="block rounded-lg border border-stone-200 bg-white p-5 hover:shadow-md hover:border-amber-300 transition"
            >
              <h2 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                {act.act_title}
              </h2>
              <p className="text-xs text-stone-500 mb-2">{act.act_number}</p>
              {act.enactment_date && (
                <p className="text-xs text-stone-400 mb-2">Enacted {act.enactment_date}</p>
              )}
              <p className="text-xs font-medium text-amber-700 mb-2">
                {act.sectionCount} sections
              </p>
              {act.blurb && <p className="text-sm text-stone-600 line-clamp-3">{act.blurb}</p>}
            </Link>
          ))}
        </div>

        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5 hover:bg-amber-100 hover:border-amber-300 transition"
        >
          <MessageSquarePlus className="w-6 h-6 text-amber-700 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-stone-800">Have suggestions or feedback?</p>
            <p className="text-xs text-stone-500">
              Tell us your name, institute, and course — we'd love to hear what you think.
            </p>
          </div>
        </a>
      </main>
    </div>
  );
}
