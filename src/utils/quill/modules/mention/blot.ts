import Quill from "quill";

import { blotName, className, tagName } from "utils/quill/modules/mention/consts";
import { MentionEmbed } from "utils/quill/modules/mention/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Embed: any = Quill.import("blots/embed");

export class MentionBlot extends Embed {
  static create(data: MentionEmbed) {
    const node = super.create();
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
      value: node.getAttribute("data-value")!,
    };
  }

  /**
   * modification to handle embed blot not being deleted properly on android
   * thread: https://github.com/quilljs/quill/issues/1985
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(mutations: any, context: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutations.forEach((mutation: any) => {
      if (
        mutation.type === "childList" &&
        (Array.from(mutation.removedNodes).includes(this.leftGuard) ||
          Array.from(mutation.removedNodes).includes(this.rightGuard))
      ) {
        if (mutation.target?.classList?.contains(blotName)) {
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
