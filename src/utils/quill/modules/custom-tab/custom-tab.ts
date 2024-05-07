import Quill, { QuillOptions } from "quill/core";

// const { BlockBlot } = Quill.import("parchment");

export class CustomTab {
  quill: Quill;

  constructor(quill: Quill, _options: QuillOptions) {
    this.tabHandler = this.tabHandler.bind(this);

    this.quill = quill;

    this.quill.keyboard.addBinding(
      {
        key: "Tab",
      },
      this.tabHandler.bind(this),
    );
    this.quill.keyboard.bindings.Tab.unshift(this.quill.keyboard.bindings.Tab.pop()!);
  }

  tabHandler() {
    this.quill.format("indent", "+1");
    return false;
  }
}
