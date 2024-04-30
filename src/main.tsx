import "./index.scss";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "components/app";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
