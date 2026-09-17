import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SectionContextValue {
  activeSection: string | null;
  setActiveSection: (sectionNumber: string | null) => void;
}

const SectionContext = createContext<SectionContextValue | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const value = useMemo(() => ({ activeSection, setActiveSection }), [activeSection]);

  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
}

export function useSectionContext(): SectionContextValue {
  const ctx = useContext(SectionContext);
  if (!ctx) {
    throw new Error("useSectionContext must be used within a SectionProvider");
  }
  return ctx;
}
