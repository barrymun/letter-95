import { FC } from "react";
import original from "react95/dist/themes/original";
import { ThemeProvider } from "styled-components";

import { AppBar } from "components/app-bar";
import { GlobalStyles } from "components/global-styles";
import { Container, Layout } from "components/layout";
import { RichTextEditor } from "components/rich-text-editor";

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Layout>
          <AppBar />
          <Container>
            <RichTextEditor />
          </Container>
        </Layout>
      </ThemeProvider>
    </>
  );
};

export { App };
