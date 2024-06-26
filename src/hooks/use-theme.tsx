import { createContext, useContext, useMemo, useState } from "react";
import themes from "react95/dist/themes";
import { Theme as R95Theme } from "react95/dist/types";
import { ThemeProvider as R95ThemeProvider } from "styled-components";

import { useLocalStorage } from "hooks/use-local-storage";
import { LocalStorageKeys } from "utils";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext({
  theme: themes.original,
  setTheme: (_: R95Theme) => {},
});

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { getValue } = useLocalStorage();

  const [theme, setTheme] = useState<R95Theme>(() => {
    try {
      const storedTheme = getValue(LocalStorageKeys.Theme);
      return storedTheme ? JSON.parse(storedTheme) : themes.original;
    } catch (error) {
      return themes.original;
    }
  });

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme],
  );
  return (
    <ThemeContext.Provider value={value}>
      <R95ThemeProvider theme={theme}>{children}</R95ThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
