import "./index.scss";
import "quill/dist/quill.snow.css";
import "utils/quill/modules/menu/menu.scss";
import "utils/quill/modules/mention/mention.scss";
import "utils/quill/modules/custom-emoji-mart/custom-emoji-mart.scss";

import { StrictMode, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";

import { EditorProvider, LocalStorageProvider, ThemeProvider } from "hooks";

const App = lazy(() => import("components/app"));
const GlobalStyles = lazy(() => import("components/global-styles"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense>
      <GlobalStyles />
    </Suspense>
    <LocalStorageProvider>
      <ThemeProvider>
        <EditorProvider>
          <Suspense>
            <App />
          </Suspense>
        </EditorProvider>
      </ThemeProvider>
    </LocalStorageProvider>
  </StrictMode>,
);
