import { FC } from "react";
import original from "react95/dist/themes/original";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "components/global-styles";

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>HERE</ThemeProvider>
    </>
  );
};

export { App };
