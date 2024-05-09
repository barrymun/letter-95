import { FC, Suspense, lazy } from "react";
import original from "react95/dist/themes/original";
import { ThemeProvider } from "styled-components";

import { AppBar } from "components/app-bar";
import { GlobalStyles } from "components/global-styles";
import { Container, Layout } from "components/layout";

const RichTextEditor = lazy(() => import("components/rich-text-editor/rich-text-editor"));

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Layout>
          <AppBar />
          <Container>
            <Suspense>
              <RichTextEditor />
            </Suspense>
          </Container>
        </Layout>
      </ThemeProvider>
    </>
  );
};

export { App };
