import Quill from "quill/core";
import Bold from "quill/formats/bold";
import Header from "quill/formats/header";
import Italic from "quill/formats/italic";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import { FC, useEffect, useRef } from "react";

Quill.register({
  "modules/toolbar": Toolbar,
  "themes/snow": Snow,
  "formats/bold": Bold,
  "formats/italic": Italic,
  "formats/header": Header,
});

interface RichTextEditorProps {}

const RichTextEditor: FC<RichTextEditorProps> = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.focus();
  //   }
  // }, []);

  useEffect(() => {
    if (!ref?.current || ref?.current?.classList.contains("ql-container")) {
      return;
    }
    // eslint-disable-next-line no-new
    new Quill(ref?.current, {
      theme: "snow",
    });
  }, [ref?.current]);

  return <div ref={ref} />;
};

export { RichTextEditor };
