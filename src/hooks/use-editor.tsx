import { Delta } from "quill/core";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useLocalStorage } from "hooks/use-local-storage";
import { LocalStorageKeys } from "utils";

interface EditorProviderProps {
  children: React.ReactNode;
}

const EditorContext = createContext({
  shouldClear: false,
  editorDelta: new Delta(),
  setShouldClear: (_: boolean) => {},
  setEditorDelta: (_: Delta) => {},
});

const EditorProvider = ({ children }: EditorProviderProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [shouldClear, setShouldClear] = useState<boolean>(false);
  const [editorDelta, setEditorDelta] = useState<Delta>(new Delta());

  const { getValue, setValue } = useLocalStorage();

  const value = useMemo(
    () => ({
      shouldClear,
      editorDelta,
      setShouldClear,
      setEditorDelta,
    }),
    [shouldClear, editorDelta, setShouldClear, setEditorDelta],
  );

  /**
   * save editor delta to local storage on delta change
   */
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    setValue(LocalStorageKeys.EditorDelta, JSON.stringify(editorDelta));
  }, [isLoaded, editorDelta]);

  /**
   * load editor delta from local storage (if available)
   */
  useEffect(() => {
    const storedEditorDelta = getValue(LocalStorageKeys.EditorDelta);
    if (!storedEditorDelta) {
      setIsLoaded(true);
      return;
    }
    try {
      setEditorDelta(new Delta(JSON.parse(storedEditorDelta)));
    } catch (e) {
      // no-op
    }
    setIsLoaded(true);
  }, []);

  return <EditorContext.Provider value={value}>{isLoaded ? children : null}</EditorContext.Provider>;
};

const useEditor = () => useContext(EditorContext);

export { EditorProvider, useEditor };
