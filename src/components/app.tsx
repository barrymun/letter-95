import { FC, Suspense, lazy } from "react";

import { AppBar } from "components/app-bar";
import { Container, Layout } from "components/layout";

const RichTextEditor = lazy(() => import("components/rich-text-editor/rich-text-editor"));

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <Layout>
      <AppBar />
      <Container>
        <Suspense>
          <RichTextEditor />
        </Suspense>
      </Container>
    </Layout>
  );
};

export default App;
