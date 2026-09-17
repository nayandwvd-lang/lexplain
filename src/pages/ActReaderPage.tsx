import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BareActCanvas from "../components/BareActCanvas";
import SectionInspector from "../components/SectionInspector";
import NotFound from "./NotFound";
import { SectionProvider, useSectionContext } from "../state/SectionContext";
import { getActBySlug } from "../data/actRegistry";
import type { BareActDocument } from "../types/act";

function ActReader({ actData }: { actData: BareActDocument }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { activeSection, setActiveSection } = useSectionContext();

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return actData.sections;
    return actData.sections.filter(
      (s) =>
        s.number.toLowerCase().includes(query) ||
        s.title.toLowerCase().includes(query) ||
        s.raw_text.toLowerCase().includes(query)
    );
  }, [searchQuery, actData]);

  const selectedSection = actData.sections.find((s) => s.number === activeSection) ?? null;

  return (
    <div>
      <Navbar
        actTitle={actData.act_title}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <BareActCanvas actData={actData} sections={filteredSections} />
      <SectionInspector section={selectedSection} onClose={() => setActiveSection(null)} />
    </div>
  );
}

export default function ActReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const actData = slug ? getActBySlug(slug) : undefined;

  if (!actData) return <NotFound />;

  return (
    <SectionProvider key={slug}>
      <ActReader actData={actData} />
    </SectionProvider>
  );
}
