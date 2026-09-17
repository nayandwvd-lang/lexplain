import * as Tooltip from "@radix-ui/react-tooltip";

interface GlossaryWordProps {
  term: string;
  definition: string;
}

export default function GlossaryWord({ term, definition }: GlossaryWordProps) {
  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <span className="border-b-2 border-dotted border-amber-500 cursor-help">
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
