import { Search, Upload, ScrollText } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "react-router-dom";

interface NavbarProps {
  actTitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ actTitle, searchQuery, onSearchChange }: NavbarProps) {
  return (
    <header className="font-sans sticky top-0 z-40 flex items-center gap-4 border-b border-stone-200 bg-white/90 backdrop-blur px-4 py-3 shadow-sm">
      <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
        <ScrollText className="w-5 h-5 text-amber-600" />
        <span className="font-semibold text-stone-800">{actTitle}</span>
      </Link>

      <div className="flex-1 flex items-center gap-2 max-w-md bg-stone-100 rounded-md px-3 py-1.5">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search sections by number, title, or text..."
          className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none"
        />
      </div>

      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="flex items-center gap-1.5 text-sm text-stone-400 border border-stone-200 rounded-md px-3 py-1.5 cursor-not-allowed shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload PDF
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={6}
            className="bg-stone-900 text-stone-100 text-xs rounded-md p-2.5 shadow-xl max-w-xs z-50"
          >
            Coming soon
            <Tooltip.Arrow className="fill-stone-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </header>
  );
}
