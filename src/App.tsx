import * as Tooltip from "@radix-ui/react-tooltip";
import { Routes, Route } from "react-router-dom";
import Library from "./pages/Library";
import ActReaderPage from "./pages/ActReaderPage";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./state/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <Tooltip.Provider>
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/acts/:slug" element={<ActReaderPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Tooltip.Provider>
    </LanguageProvider>
  );
}
