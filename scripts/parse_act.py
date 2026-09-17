#!/usr/bin/env python3
"""Converts a plain-text Bare Act into BareActDocument-shaped JSON via Claude tool calling.

Requires: Python 3.11+, `pip install anthropic pydantic`, and ANTHROPIC_API_KEY set.
Output must validate against src/types/act.ts (BareActDocument) — keep both in sync.
Output defaults to src/data/acts/<slug>.json; the filename is the URL slug the
frontend's actRegistry.ts discovers acts by, so --slug should be stable and unique.
"""
import os
import re
import json
import argparse
from typing import List, Optional
from pydantic import BaseModel, Field
import anthropic

MODEL_ID = "claude-sonnet-4-6"
DEFAULT_ACTS_DIR = "src/data/acts"


class GlossaryEntry(BaseModel):
    term: str = Field(description="The technical or complex legal term (lowercased).")
    definition: str = Field(description="1-2 sentence plain-English explanation for non-lawyers.")


class SectionBreakdown(BaseModel):
    plain_summary: str = Field(description="2-3 sentence layman explanation of the section's legal effect.")
    essential_elements: List[str] = Field(description="Checklist of mandatory conditions/ingredients required.")
    exceptions_and_qualifications: List[str] = Field(description="Exceptions, caveats, or provisos limiting scope.")
    how_to_read: str = Field(description="Statutory interpretation cues, syntax rules, and cross-references.")


class EnrichedSectionData(BaseModel):
    key_terms: List[str] = Field(description="Verbatim legal terms found in this section.")
    glossary_items: List[GlossaryEntry]
    breakdown: SectionBreakdown


ANALYSIS_TOOL = {
    "name": "save_section_analysis",
    "description": "Saves structured legal breakdown and definitions for a statutory section.",
    "input_schema": EnrichedSectionData.model_json_schema(),
}

SYSTEM_PROMPT = """You are an expert statutory analyst and legal educator.
Deconstruct bare acts into plain-English definitions, prerequisite ingredients, and practical reading rules.
Avoid dense legalese. Be concise, structured, and legally accurate."""


def parse_and_enrich(
    input_file: str,
    output_file: str,
    act_title: str,
    act_number: str,
    enactment_date: Optional[str] = None,
    preamble: Optional[str] = None,
    limit: Optional[int] = None,
) -> None:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    with open(input_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Section matching pattern: e.g., "10. What agreements are contracts.—..."
    pattern = re.compile(r"(?m)^(?:\s*Section\s+)?(\d+[A-Z]?)\.\s*([^—–\-\n\.]+?)[—–\-\.]\s*(.*)$")
    matches = list(pattern.finditer(text))

    sections = []
    # First-write-wins: earlier sections' phrasing of a shared term takes precedence.
    global_glossary: dict[str, str] = {}

    for i, m in enumerate(matches[:limit] if limit else matches):
        sec_num, title = m.group(1).strip(), m.group(2).strip()
        end_pos = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        raw_body = m.group(3) + text[m.end():end_pos]
        raw_text = f"{sec_num}. {title}—{raw_body.strip()}"

        resp = client.messages.create(
            model=MODEL_ID,
            max_tokens=2500,
            temperature=0.1,
            system=SYSTEM_PROMPT,
            tools=[ANALYSIS_TOOL],
            tool_choice={"type": "tool", "name": "save_section_analysis"},
            messages=[{"role": "user", "content": f"Section {sec_num}: {title}\nText:\n{raw_text}"}],
        )

        tool_call = next(b for b in resp.content if b.type == "tool_use")
        analysis = EnrichedSectionData.model_validate(tool_call.input)

        for entry in analysis.glossary_items:
            key = entry.term.lower()
            if key not in global_glossary:
                global_glossary[key] = entry.definition

        sections.append(
            {
                "number": sec_num,
                "title": title,
                "raw_text": raw_text,
                "key_terms": analysis.key_terms,
                "breakdown": analysis.breakdown.model_dump(),
            }
        )

    document = {
        "act_title": act_title,
        "act_number": act_number,
        "enactment_date": enactment_date,
        "preamble": preamble,
        "glossary": global_glossary,
        "sections": sections,
    }

    os.makedirs(os.path.dirname(output_file) or ".", exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as out:
        json.dump(document, out, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    parser.add_argument("--slug", required=True, help="URL-safe id; output defaults to src/data/acts/<slug>.json")
    parser.add_argument("--output", "-o", help="Override output path (defaults to src/data/acts/<slug>.json)")
    parser.add_argument("--act-title", required=True)
    parser.add_argument("--act-number", required=True)
    parser.add_argument("--enactment-date")
    parser.add_argument("--preamble")
    parser.add_argument("--limit", "-l", type=int)
    args = parser.parse_args()
    output_path = args.output or os.path.join(DEFAULT_ACTS_DIR, f"{args.slug}.json")
    parse_and_enrich(
        input_file=args.input,
        output_file=output_path,
        act_title=args.act_title,
        act_number=args.act_number,
        enactment_date=args.enactment_date,
        preamble=args.preamble,
        limit=args.limit,
    )
