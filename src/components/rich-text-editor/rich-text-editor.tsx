import "./rich-text-editor.scss";

import emojiData, { EmojiMartData } from "@emoji-mart/data";
import omit from "lodash/omit";
import QuillBlock from "quill/blots/block";
import Quill, { Delta, EmitterSource, Op } from "quill/core";
import Emitter from "quill/core/emitter";
import Bold from "quill/formats/bold";
import Header from "quill/formats/header";
import Italic from "quill/formats/italic";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import { FC, Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";

import { useEditor, useTheme } from "hooks";
import { extractMentionedUsers } from "utils";
import { CustomEmoji } from "utils/quill/modules/custom-emoji";
import { CustomEmojiMart } from "utils/quill/modules/custom-emoji-mart";
import { CustomTab } from "utils/quill/modules/custom-tab";
import { Mention } from "utils/quill/modules/mention";
import { MenuOption } from "utils/quill/modules/menu/types";

const CustomToolbar = lazy(() => import("components/rich-text-editor/custom-toolbar"));

Quill.register({
  "themes/snow": Snow,
  "formats/bold": Bold,
  "formats/italic": Italic,
  "formats/header": Header,
  "modules/toolbar": Toolbar,
  "modules/custom-tab": CustomTab,
  "modules/mention": Mention,
  "modules/custom-emoji": CustomEmoji,
  "modules/custom-emoji-mart": CustomEmojiMart,
});

// use 'div' instead of 'p' for block elements
const Block = Quill.import("blots/block") as typeof QuillBlock;
Block.tagName = "DIV";
Quill.register(Block, true);

const mentionData = [
  {
    value: "1",
    label: "John Doe",
  },
  {
    value: "2",
    label: "Jane Doe",
  },
  {
    value: "3",
    label: "John Smith",
  },
  {
    value: "4",
    label: "Jane Smith",
  },
];

interface RichTextEditorProps {}

const RichTextEditor: FC<RichTextEditorProps> = () => {
  const { theme } = useTheme();

  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [quill, setQuill] = useState<Quill | null>(null);

  const { shouldClear, editorDelta, setShouldClear, setEditorDelta } = useEditor();

  /**
   * adjust the editor's margin top to account for the toolbar's height
   */
  const handleResize = useCallback(() => {
    if (!editorRef?.current || !toolbarRef?.current) {
      return;
    }
    const toolbarHeight = toolbarRef.current.offsetHeight;
    editorRef.current.style.marginTop = `${toolbarHeight}px`;
  }, []);

  const handleTextChange = useCallback(
    (_delta: Delta, _oldDelta: Delta, _source: EmitterSource) => {
      if (!quill) {
        return;
      }

      setEditorDelta(quill.getContents());
    },
    [quill],
  );

  const updateThemeDeps = useCallback(() => {
    if (!toolbarRef) {
      return;
    }
    const buttons = toolbarRef.current?.querySelectorAll("button");
    if (!buttons) {
      return;
    }
    Array.from(buttons).forEach((button) => {
      if (
        button.classList.contains("ql-picker") ||
        button.classList.contains("ql-link") ||
        button.classList.contains("ql-image") ||
        button.classList.contains("ql-emoji")
      ) {
        return;
      }

      // change the path stroke color within the button
      const paths = button.querySelectorAll("path");
      Array.from(paths).forEach((path) => {
        // eslint-disable-next-line no-param-reassign
        path.style.stroke = theme.materialText;
      });

      // change the line stroke color within the button
      const lines = button.querySelectorAll("line");
      Array.from(lines).forEach((line) => {
        // eslint-disable-next-line no-param-reassign
        line.style.stroke = theme.materialText;
      });
    });
  }, [toolbarRef, theme]);

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
          "custom-tab": {},
          mention: {
            data: [],
            editorLeftOffset: 0,
          },
          "custom-emoji": {
            data: [],
            editorLeftOffset: 0,
          },
          "custom-emoji-mart": {},
        },
      }),
    );
  }, [editorRef]);

  /**
   * auto focus the editor
   */
  useEffect(() => {
    if (quill) {
      quill.focus();
    }
  }, [quill]);

  /**
   * remove unwanted formatting on paste
   */
  useEffect(() => {
    if (!quill) {
      return;
    }
    quill.clipboard?.addMatcher?.(Node.ELEMENT_NODE, (_node: Node, delta: Delta) => {
      // eslint-disable-next-line no-param-reassign
      delta.ops = delta.ops.map((op: Op) => {
        // omit unwanted attributes
        if (op.attributes) {
          const newAttributes = omit(op.attributes, [
            "color",
            "background",
            "align",
            "header",
            "code",
            "contenteditable",
            "code-block",
          ]);
          return { ...op, attributes: newAttributes };
        }
        // check if the user is trying to paste a mention that already exists
        if (op.insert && (op.insert as { mention?: MenuOption })?.mention) {
          const mentionedUsers = extractMentionedUsers(quill.root.innerHTML ?? "");
          const { value } = (op.insert as { mention: MenuOption }).mention;
          if (mentionedUsers.includes(value)) {
            return { insert: "" };
          }
        }
        return op;
      });
      return delta;
    });
    quill.clipboard?.addMatcher?.("VIDEO", (_node: Node, _delta: Delta) => {
      const delta = new Delta();
      return delta;
    });
  }, [quill]);

  useEffect(() => {
    const module = quill?.getModule("mention") as Mention | undefined;
    if (!module) {
      return;
    }
    module.data = mentionData;
  }, [quill]);

  useEffect(() => {
    const module = quill?.getModule("custom-emoji") as CustomEmoji | undefined;
    if (!module) {
      return;
    }
    module.data = Object.entries((emojiData as EmojiMartData).emojis).map(([name, emoji]) => ({
      value: emoji.skins?.[0].native ?? "",
      label: `${emoji.skins?.[0].native ?? ""} ${name} `,
    }));
  }, [quill]);

  /**
   * ensure correct sizing on load
   */
  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    if (!quill) {
      return;
    }
    quill.on("text-change", handleTextChange);
    // eslint-disable-next-line consistent-return
    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill]);

  /**
   * clear the editor's content
   */
  useEffect(() => {
    if (!quill) {
      return;
    }
    if (!shouldClear) {
      return;
    }
    quill.setContents(new Delta(), Emitter.sources.USER);
    setShouldClear(false);
    quill.focus();
  }, [shouldClear]);

  /**
   * set the editor's content on load
   */
  useEffect(() => {
    if (!quill) {
      return;
    }
    quill.setContents(editorDelta, Emitter.sources.SILENT);
  }, [quill]);

  useEffect(() => {
    updateThemeDeps();
  }, [theme]);

  return (
    <>
      <Suspense>
        <CustomToolbar ref={toolbarRef} />
      </Suspense>
      <div className="rich-text-editor">
        <div ref={editorRef} />
      </div>
    </>
  );
};

export default RichTextEditor;
