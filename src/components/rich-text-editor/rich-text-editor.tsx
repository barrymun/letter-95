import Quill from "quill";
import Bold from "quill/formats/bold";
import Header from "quill/formats/header";
import Italic from "quill/formats/italic";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import { FC, useEffect, useRef } from "react";

import { CustomToolbar } from "components/rich-text-editor/custom-toolbar";

Quill.register({
  "modules/toolbar": Toolbar,
  "themes/snow": Snow,
  "formats/bold": Bold,
  "formats/italic": Italic,
  "formats/header": Header,
});

interface RichTextEditorProps {}

const RichTextEditor: FC<RichTextEditorProps> = () => {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.focus();
  //   }
  // }, []);

  // const modules = useMemo(() => {
  //   return {
  //     toolbar: {
  //       container: toolbarRef.current,
  //     },
  //   };
  // }, [toolbarRef]);

  useEffect(() => {
    if (!editorRef?.current || editorRef?.current?.classList.contains("ql-container")) {
      return;
    }
    // eslint-disable-next-line no-new
    new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: {
          container: toolbarRef.current,
        },
      },
    });
  }, [editorRef?.current, toolbarRef?.current]);

  return (
    <>
      <CustomToolbar ref={toolbarRef} />
      {/* {!!toolbarRef.current && <div ref={editorRef} />} */}
      <div ref={editorRef} />
    </>
  );
};

export { RichTextEditor };
