import "./index.scss";
import "quill/dist/quill.snow.css";
import "utils/quill/modules/menu/menu.scss";
import "utils/quill/modules/mention/mention.scss";
import "utils/quill/modules/custom-emoji-mart/custom-emoji-mart.scss";

import emojiData from "@emoji-mart/data";
import { init } from "emoji-mart";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "components/app";

init({ data: emojiData });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
