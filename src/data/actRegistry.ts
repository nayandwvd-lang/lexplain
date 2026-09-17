import type { BareActDocument, ActSummary } from "../types/act";

const modules = import.meta.glob("/src/data/acts/*.json", {
  eager: true,
  import: "default",
}) as Record<string, BareActDocument>;

function slugFromPath(path: string): string {
  const match = path.match(/([^/]+)\.json$/);
  if (!match) throw new Error(`Could not derive slug from path: ${path}`);
  return match[1];
}

export const actsBySlug: Record<string, BareActDocument> = Object.fromEntries(
  Object.entries(modules).map(([path, doc]) => [slugFromPath(path), doc])
);

export const actSummaries: ActSummary[] = Object.entries(actsBySlug)
  .map(([slug, doc]) => ({
    slug,
    act_title: doc.act_title,
    act_number: doc.act_number,
    enactment_date: doc.enactment_date,
    sectionCount: doc.sections.length,
    blurb: doc.preamble
      ? doc.preamble.slice(0, 160) + (doc.preamble.length > 160 ? "…" : "")
      : undefined,
  }))
  .sort((a, b) => a.act_title.localeCompare(b.act_title));

export function getActBySlug(slug: string): BareActDocument | undefined {
  return actsBySlug[slug];
}
