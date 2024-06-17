import "./index.scss";
import "quill/dist/quill.snow.css";
import "utils/quill/modules/menu/menu.scss";
import "utils/quill/modules/mention/mention.scss";
import "utils/quill/modules/custom-emoji-mart/custom-emoji-mart.scss";

import emojiData from "@emoji-mart/data";
import { init } from "emoji-mart";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import original from "react95/dist/themes/original";
import { ThemeProvider } from "styled-components";

const App = lazy(() => import("components/app"));
const GlobalStyles = lazy(() => import("components/global-styles"));

init({ data: emojiData });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense>
      <GlobalStyles />
    </Suspense>
    <ThemeProvider theme={original}>
      <Suspense>
        <App />
      </Suspense>
    </ThemeProvider>
  </React.StrictMode>,
);
