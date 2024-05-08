import Quill from "quill";

import { blotName, className, tagName } from "utils/quill/modules/mention/consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Embed: any = Quill.import("blots/embed");

export class MentionBlot extends Embed {
  static create(data: { id: string; value: string }) {
    const node = super.create();
    node.dataset.id = data.id;
    node.dataset.value = data.value;
    return node;
  }

  static value(node: HTMLElement) {
    return {
      id: node.dataset.id,
      value: node.dataset.value,
    };
  }
}

MentionBlot.blotName = blotName;
MentionBlot.className = className;
MentionBlot.tagName = tagName;
