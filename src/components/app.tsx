import { FC } from "react";
import original from "react95/dist/themes/original";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "components/global-styles";
import { RichTextEditor } from "components/rich-text-editor";

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <RichTextEditor />
      </ThemeProvider>
    </>
  );
};

export { App };
