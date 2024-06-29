import "quill/dist/quill.snow.css";
import "utils/quill/modules/menu/menu.scss";
import "utils/quill/modules/mention/mention.scss";
import "utils/quill/modules/custom-emoji-mart/custom-emoji-mart.scss";
import "index.scss";
import "i18n/config";

import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

import { EditorProvider, LocalStorageProvider, ThemeProvider } from "hooks";

const App = lazy(() => import("components/app"));
const GlobalStyles = lazy(() => import("components/global-styles"));
const Tutorial = lazy(() => import("components/tutorial/tutorial"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense>
      <GlobalStyles />
    </Suspense>
    <LocalStorageProvider>
      <ThemeProvider>
        <EditorProvider>
          <Suspense>
            <App />
            <Tutorial />
          </Suspense>
        </EditorProvider>
      </ThemeProvider>
    </LocalStorageProvider>
  </StrictMode>,
);
