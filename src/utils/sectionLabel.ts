// Section/Rule numbers are plain free-text strings (see src/types/act.ts).
// Numbered Sections of the main Act body use bare numbers ("158"); rules of
// the First Schedule's Orders use the synthetic scheme "O-<roman>-<rule>"
// (e.g. "O-I-1", "O-XXI-37", "O-I-8A") with "O-<roman>" alone reserved for a
// per-Order overview entry. Some Orders are themselves lettered sub-Orders
// inserted by amendment (e.g. Order XIII-A, Summary Judgment) — those use
// an inserted "-<letter>" segment ("O-XIII-A-1", overview "O-XIII-A").
// Separately, some Orders (e.g. Order XI) are substituted wholesale for
// commercial-division suits by the Commercial Courts Act, 2015 — those
// parallel rule sets use a further inserted "-CC-" segment
// ("O-XI-CC-1", overview "O-XI-CC") to avoid colliding with the general
// Order's own numbering. This derives the correct human-readable label for
// any of these shapes without requiring a schema change or per-act branching.
export function sectionLabel(number: string): string {
  const ruleMatch = number.match(/^O-([IVXL]+)(-[A-Z])?(-CC)?-(.+)$/);
  if (ruleMatch) {
    const orderLabel = `Order ${ruleMatch[1]}${ruleMatch[2] ?? ""}${ruleMatch[3] ? " (Commercial Courts)" : ""}`;
    return `${orderLabel}, Rule ${ruleMatch[4]}`;
  }
  const overviewMatch = number.match(/^O-([IVXL]+)(-[A-Z])?(-CC)?$/);
  if (overviewMatch) {
    return `Order ${overviewMatch[1]}${overviewMatch[2] ?? ""}${overviewMatch[3] ? " (Commercial Courts)" : ""}`;
  }
  return `Section ${number}`;
}
