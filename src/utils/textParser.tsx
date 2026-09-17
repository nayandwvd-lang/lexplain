import type { ReactNode } from "react";
import GlossaryWord from "../components/GlossaryWord";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits rawText into a sequence of plain-text and <GlossaryWord> nodes,
 * matching glossary terms case-insensitively as whole words in a single
 * linear pass (so already-matched spans are never re-scanned/double-wrapped).
 */
export function tokenizeWithGlossary(
  rawText: string,
  glossary: Record<string, string>
): ReactNode[] {
  const terms = Object.keys(glossary).filter((t) => t.length > 0);
  if (terms.length === 0) {
    return [rawText];
  }

  // Longest terms first, so multi-word phrases match before a shorter
  // substring of them would incorrectly consume part of the phrase.
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  const pattern = sortedTerms.map(escapeRegExp).join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

  const lowerGlossary: Record<string, string> = {};
  for (const term of terms) {
    lowerGlossary[term.toLowerCase()] = glossary[term];
  }

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(rawText)) !== null) {
    const matchedText = match[0];
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(rawText.slice(lastIndex, start));
    }

    const definition = lowerGlossary[matchedText.toLowerCase()];
    if (definition) {
      nodes.push(
        <GlossaryWord key={`gw-${key++}`} term={matchedText} definition={definition} />
      );
    } else {
      nodes.push(matchedText);
    }

    lastIndex = start + matchedText.length;
  }

  if (lastIndex < rawText.length) {
    nodes.push(rawText.slice(lastIndex));
  }

  return nodes;
}
