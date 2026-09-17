export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface SectionBreakdown {
  plain_summary: string;
  essential_elements: string[];
  exceptions_and_qualifications: string[];
  how_to_read: string;
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
