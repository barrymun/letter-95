import Quill from "quill"; // importing from quill/core here partially breaks the toolbar for some reason
import QuillEmbed from "quill/blots/embed";

import { blotName, className, tagName } from "utils/quill/modules/mention/consts";
import { MentionEmbed } from "utils/quill/modules/mention/types";

const Embed = Quill.import("blots/embed") as typeof QuillEmbed;

export class MentionBlot extends Embed {
  static create(data: MentionEmbed) {
    const node = super.create() as HTMLElement;
    let text: string;
    if (data.triggerCharacter) {
      text = `${data.triggerCharacter}${data.label}`;
    } else {
      // handles undo/redo case
      text = data.label;
    }
    node.setAttribute("data-value", data.value); // use this to get the value when associating tagged users
    node.innerText = text;
    return node;
  }

  static value(node: HTMLElement): MentionEmbed {
    return {
      label: node.innerText,
      value: node.getAttribute("data-value") ?? "",
    };
  }

  /**
   * modification to handle embed blot not being deleted properly on android
   * thread: https://github.com/quilljs/quill/issues/1985
   * function types code: https://github.com/quilljs/quill/blob/main/packages/quill/src/blots/embed.ts#L79
   */
  update(mutations: MutationRecord[], context: Record<string, unknown>) {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "childList" &&
        (Array.from(mutation.removedNodes).includes(this.leftGuard) ||
          Array.from(mutation.removedNodes).includes(this.rightGuard))
      ) {
        if ((mutation.target as HTMLElement | null)?.classList?.contains(blotName)) {
          super.replaceWith("text", "");
        }
      }
    });
    super.update(mutations, context);
  }
}

MentionBlot.blotName = blotName;
MentionBlot.className = className;
MentionBlot.tagName = tagName;
