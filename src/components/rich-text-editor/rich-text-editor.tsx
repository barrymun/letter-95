import "./rich-text-editor.scss";

import emojiData, { EmojiMartData } from "@emoji-mart/data";
import omit from "lodash/omit";
import QuillBlock from "quill/blots/block";
import Quill, { Delta, Op } from "quill/core";
import Bold from "quill/formats/bold";
import Header from "quill/formats/header";
import Italic from "quill/formats/italic";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import { FC, Suspense, lazy, useEffect, useRef, useState } from "react";

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
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [quill, setQuill] = useState<Quill | null>(null);

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

  return (
    <div className="rich-text-editor">
      <Suspense>
        <CustomToolbar ref={toolbarRef} />
      </Suspense>
      <div ref={editorRef} />
    </div>
  );
};

export default RichTextEditor;
