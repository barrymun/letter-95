import "./rich-text-editor.scss";

import emojiData, { EmojiMartData } from "@emoji-mart/data";
import { omit } from "lodash";
import Quill from "quill";
import { Delta, Op } from "quill/core";
import Bold from "quill/formats/bold";
import Header from "quill/formats/header";
import Italic from "quill/formats/italic";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import { FC, useEffect, useRef, useState } from "react";

import { CustomToolbar } from "components/rich-text-editor/custom-toolbar";
import { extractMentionedUsers } from "utils";
import { MenuOption } from "utils/quill";
import { CustomEmoji } from "utils/quill/modules/custom-emoji";
import { CustomTab } from "utils/quill/modules/custom-tab";
import { Mention } from "utils/quill/modules/mention";

Quill.register({
  "modules/toolbar": Toolbar,
  "themes/snow": Snow,
  "formats/bold": Bold,
  "formats/italic": Italic,
  "formats/header": Header,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Quill.register("modules/custom-tab", CustomTab as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Quill.register("modules/mention", Mention as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Quill.register("modules/custom-emoji", CustomEmoji as any);

// use 'div' instead of 'p' for block elements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Block: any = Quill.import("blots/block");
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
        },
      }),
    );
  }, [editorRef]);

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
          const value = parseInt((op.insert as { mention: MenuOption }).mention.value, 10);
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
    const mentionModule: Mention | undefined = quill?.getModule("mention") as Mention | undefined;
    if (!mentionModule) {
      return;
    }
    mentionModule.data = mentionData;
  }, [quill]);

  useEffect(() => {
    const customEmojiModule: Mention | undefined = quill?.getModule("custom-emoji") as Mention | undefined;
    if (!customEmojiModule) {
      return;
    }
    customEmojiModule.data = Object.entries((emojiData as EmojiMartData).emojis).map(([name, emoji]) => ({
      value: emoji.skins?.[0].native ?? "",
      label: `${emoji.skins?.[0].native ?? ""} ${name} `,
    }));
  }, [quill]);

  return (
    <div className="rich-text-editor">
      <CustomToolbar ref={toolbarRef} />
      <div ref={editorRef} />
    </div>
  );
};

export { RichTextEditor };
