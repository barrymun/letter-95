import "./rich-text-editor.scss";

import Quill from "quill";
import Bold from "quill/formats/bold";
import Header from "quill/formats/header";
import Italic from "quill/formats/italic";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import { FC, useEffect, useRef, useState } from "react";

import { CustomToolbar } from "components/rich-text-editor/custom-toolbar";

Quill.register({
  "modules/toolbar": Toolbar,
  "themes/snow": Snow,
  "formats/bold": Bold,
  "formats/italic": Italic,
  "formats/header": Header,
});

// use 'div' instead of 'p' for block elements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Block: any = Quill.import("blots/block");
Block.tagName = "DIV";
Quill.register(Block, true);

interface RichTextEditorProps {}

const RichTextEditor: FC<RichTextEditorProps> = () => {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    if (quill) {
      quill.focus();
    }
  }, [quill]);

  useEffect(() => {
    if (!editorRef?.current) {
      return;
    }
    if (editorRef.current.classList.contains("ql-container")) {
      return;
    }
    setQuill(
      new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarRef.current,
          },
        },
      }),
    );
  }, [editorRef]);

  return (
    <div className="rich-text-editor">
      <CustomToolbar ref={toolbarRef} />
      <div ref={editorRef} />
    </div>
  );
};

export { RichTextEditor };
