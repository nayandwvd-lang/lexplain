import { useMemo, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import Navbar from "./components/Navbar";
import BareActCanvas from "./components/BareActCanvas";
import SectionInspector from "./components/SectionInspector";
import { SectionProvider, useSectionContext } from "./state/SectionContext";
import actData from "./data/act_data.json";
import type { BareActDocument } from "./types/act";

const typedActData = actData as BareActDocument;

function AppShell() {
  const [searchQuery, setSearchQuery] = useState("");
  const { activeSection, setActiveSection } = useSectionContext();

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return typedActData.sections;
    return typedActData.sections.filter(
      (s) =>
        s.number.toLowerCase().includes(query) ||
        s.title.toLowerCase().includes(query) ||
        s.raw_text.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedSection = typedActData.sections.find((s) => s.number === activeSection) ?? null;

  return (
    <div>
      <Navbar
        actTitle={typedActData.act_title}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <BareActCanvas actData={typedActData} sections={filteredSections} />
      <SectionInspector section={selectedSection} onClose={() => setActiveSection(null)} />
    </div>
  );
}

export default function App() {
  return (
    <Tooltip.Provider>
      <SectionProvider>
        <AppShell />
      </SectionProvider>
    </Tooltip.Provider>
  );
}
