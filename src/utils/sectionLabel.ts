// Section/Rule numbers are plain free-text strings (see src/types/act.ts).
// Numbered Sections of the main Act body use bare numbers ("158"); rules of
// the First Schedule's Orders use the synthetic scheme "O-<roman>-<rule>"
// (e.g. "O-I-1", "O-XXI-37", "O-I-8A") with "O-<roman>" alone reserved for a
// per-Order overview entry. This derives the correct human-readable label
// for either shape without requiring a schema change or per-act branching.
export function sectionLabel(number: string): string {
  const ruleMatch = number.match(/^O-([IVXL]+)-(.+)$/);
  if (ruleMatch) {
    return `Order ${ruleMatch[1]}, Rule ${ruleMatch[2]}`;
  }
  const overviewMatch = number.match(/^O-([IVXL]+)$/);
  if (overviewMatch) {
    return `Order ${overviewMatch[1]}`;
  }
  return `Section ${number}`;
}
