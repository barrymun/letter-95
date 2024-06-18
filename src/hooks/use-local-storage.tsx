import { createContext, useContext, useMemo } from "react";

import { LocalStorageKeys } from "utils";

interface LocalStorageProviderProps {
  children: React.ReactNode;
}

const LocalStorageContext = createContext(
  {} as {
    getValue(key: LocalStorageKeys): string | null;
    setValue(key: LocalStorageKeys, value: string): void;
    removeValue(key: LocalStorageKeys): void;
  },
);

const LocalStorageProvider = ({ children }: LocalStorageProviderProps) => {
  const getValue = (key: LocalStorageKeys) => {
    return localStorage.getItem(key as string);
  };

  const setValue = (key: LocalStorageKeys, value: string) => {
    localStorage.setItem(key as string, value);
  };

  const removeValue = (key: LocalStorageKeys) => {
    localStorage.removeItem(key as string);
  };

  const value = useMemo(
    () => ({
      getValue,
      setValue,
      removeValue,
    }),
    [getValue, setValue, removeValue],
  );

  return <LocalStorageContext.Provider value={value}>{children}</LocalStorageContext.Provider>;
};

const useLocalStorage = () => useContext(LocalStorageContext);

export { LocalStorageProvider, useLocalStorage };
