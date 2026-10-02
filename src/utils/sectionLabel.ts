// Section/Rule numbers are plain free-text strings (see src/types/act.ts).
// Numbered Sections of the main Act body use bare numbers ("158"); rules of
// the First Schedule's Orders use the synthetic scheme "O-<roman>-<rule>"
// (e.g. "O-I-1", "O-XXI-37", "O-I-8A") with "O-<roman>" alone reserved for a
// per-Order overview entry. Some Orders (e.g. Order XI) are substituted
// wholesale for commercial-division suits by the Commercial Courts Act,
// 2015 — those parallel rule sets use an inserted "-CC-" segment
// ("O-XI-CC-1", overview "O-XI-CC") to avoid colliding with the general
// Order's own numbering. This derives the correct human-readable label for
// any of these shapes without requiring a schema change or per-act branching.
export function sectionLabel(number: string): string {
  const ruleMatch = number.match(/^O-([IVXL]+)(-CC)?-(.+)$/);
  if (ruleMatch) {
    const orderLabel = `Order ${ruleMatch[1]}${ruleMatch[2] ? " (Commercial Courts)" : ""}`;
    return `${orderLabel}, Rule ${ruleMatch[3]}`;
  }
  const overviewMatch = number.match(/^O-([IVXL]+)(-CC)?$/);
  if (overviewMatch) {
    return `Order ${overviewMatch[1]}${overviewMatch[2] ? " (Commercial Courts)" : ""}`;
  }
  return `Section ${number}`;
}
