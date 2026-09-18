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
    <header className="font-sans sticky top-0 z-40 flex items-center gap-2 sm:gap-4 border-b border-stone-200 bg-white/90 backdrop-blur px-3 sm:px-4 py-3 shadow-sm">
      <Link
        to="/"
        className="flex items-center gap-2 shrink-0 min-w-0 hover:opacity-80 transition-opacity"
      >
        <ScrollText className="w-5 h-5 text-amber-600 shrink-0" />
        <span className="hidden sm:inline font-semibold text-stone-800 truncate max-w-[240px]">
          {actTitle}
        </span>
      </Link>

      <div className="flex-1 min-w-0 flex items-center gap-2 sm:max-w-md bg-stone-100 rounded-md px-3 py-1.5">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search sections..."
          className="w-full min-w-0 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none"
        />
      </div>

      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label="Upload PDF (coming soon)"
            className="flex items-center gap-1.5 text-sm text-stone-400 border border-stone-200 rounded-md px-2.5 sm:px-3 py-1.5 cursor-not-allowed shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload PDF</span>
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
