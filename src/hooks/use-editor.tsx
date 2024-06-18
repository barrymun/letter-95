import { createContext, useContext, useMemo, useState } from "react";

interface EditorProviderProps {
  children: React.ReactNode;
}

const EditorContext = createContext({
  editorHTML: "",
  setEditorHTML: (_: string) => {},
});

const EditorProvider = ({ children }: EditorProviderProps) => {
  const [editorHTML, setEditorHTML] = useState<string>("");

  const value = useMemo(
    () => ({
      editorHTML,
      setEditorHTML,
    }),
    [editorHTML, setEditorHTML],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

const useEditor = () => useContext(EditorContext);

export { EditorProvider, useEditor };
