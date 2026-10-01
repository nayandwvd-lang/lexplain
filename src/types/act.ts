export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface SectionBreakdown {
  plain_summary: string;
  essential_elements: string[];
  exceptions_and_qualifications: string[];
  how_to_read: string;
  // Optional Hindi translations of the four fields above, for Hindi-medium
  // students. Added incrementally, act by act — absent on most sections
  // today. Consumers must fall back to the English fields when these are
  // undefined or empty.
  plain_summary_hi?: string;
  essential_elements_hi?: string[];
  exceptions_and_qualifications_hi?: string[];
  how_to_read_hi?: string;
}

export interface ActSection {
  number: string;
  title: string;
  raw_text: string;
  key_terms: string[];
  breakdown: SectionBreakdown;
}

export interface BareActDocument {
  act_title: string;
  act_number: string;
  enactment_date?: string;
  preamble?: string;
  glossary: Record<string, string>; // lowercased term -> definition
  sections: ActSection[];
}

export interface ActSummary {
  slug: string;
  act_title: string;
  act_number: string;
  enactment_date?: string;
  sectionCount: number;
  blurb?: string;
}
