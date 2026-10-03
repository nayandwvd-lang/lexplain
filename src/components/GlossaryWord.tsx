import { useEffect, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface GlossaryWordProps {
  term: string;
  definition: string;
}

export default function GlossaryWord({ term, definition }: GlossaryWordProps) {
  // On mouse/desktop, Radix's own hover handling opens this (uncontrolled
  // by default). We make it controlled so touch devices — which have no
  // hover — can open it on tap instead, without that tap also bubbling up
  // to the section and opening the Section Inspector.
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // There's no hover-leave on touch to close this for us, so close it
    // ourselves the moment the user taps anywhere else on the page.
    function handleOutsidePointer(e: PointerEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleOutsidePointer, true);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer, true);
  }, [open]);

  return (
    <Tooltip.Root open={open} onOpenChange={setOpen} delayDuration={150}>
      <Tooltip.Trigger asChild>
        <span
          ref={triggerRef}
          className="border-b-2 border-dotted border-amber-500 cursor-help touch-manipulation"
          onPointerUp={(e) => {
            // Prevent this tap from reaching the section's own tap handler,
            // which otherwise treats it as progress toward opening the
            // Section Inspector instead of just showing this definition.
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {term}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="bg-stone-900 text-stone-100 text-xs rounded-md p-2.5 shadow-xl max-w-xs font-sans z-50"
        >
          {definition}
          <Tooltip.Arrow className="fill-stone-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
