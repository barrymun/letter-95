import emojiData from "@emoji-mart/data";
import * as EmojiMart from "emoji-mart";
import Quill, { Delta, QuillOptions, Range } from "quill/core";

import { appBarHeight, defaultRange } from "utils/consts";
import { pickerClassName } from "utils/quill/modules/custom-emoji-mart/consts";

export class CustomEmojiMart {
  readonly pickerTopOffset: number = 34;

  readonly pickerBottomOffset: number = 6;

  readonly pickerWidth: number = 352;

  readonly pickerWidthOffset: number = 15; // additional offset to account for viewport padding

  readonly pickerHeight: number = 435;

  public editorLeftOffset: number = 0; // account for editors with reduced width

  protected quill: Quill;

  protected picker: HTMLDivElement;

  protected pickerLeft: number = 0;

  protected pickerTop: number = 0;

  protected currentRange: Range = defaultRange;

  constructor(quill: Quill, _options: QuillOptions) {
    this.hidePicker = this.hidePicker.bind(this);
    this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
    this.createPicker = this.createPicker.bind(this);
    this.getBounds = this.getBounds.bind(this);
    this.setPickerPosition = this.setPickerPosition.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.addToolbarButtonClickHandler = this.addToolbarButtonClickHandler.bind(this);
    this.addWindowClickHandler = this.addWindowClickHandler.bind(this);
    this.addWindowKeyupHandler = this.addWindowKeyupHandler.bind(this);
    this.addHandlers = this.addHandlers.bind(this);

    this.quill = quill;

    this.picker = this.createPicker();
    this.quill.on("text-change", this.handleTextChange);
    this.addHandlers();
  }

  hidePicker() {
    this.picker.style.display = "none";
  }

  handleEmojiSelect(emoji: { native: string }) {
    const textToInsert = emoji.native;
    this.quill.insertText(this.currentRange.index, textToInsert);
    this.quill.setSelection(this.currentRange.index + textToInsert.length, 0);
    this.hidePicker();
  }

  createPicker() {
    const pickerOptions = {
      theme: "light",
      previewPosition: "none",
      data: emojiData,
      onEmojiSelect: this.handleEmojiSelect.bind(this),
    };
    const pickerNode = new EmojiMart.Picker(pickerOptions);
    const div = document.createElement("div");
    div.className = pickerClassName;
    div.style.display = "none";
    div.style.width = `${this.pickerWidth}px`;
    div.style.height = `${this.pickerHeight}px`;
    div.appendChild(pickerNode as unknown as Node);
    this.quill.container.appendChild(div);
    return div;
  }

  getBounds() {
    return this.quill.getBounds(this.quill.getSelection() ?? 0)!;
  }

  setPickerPosition() {
    const editorWidth = this.quill.root.offsetWidth;
    const bounds = this.getBounds();
    const editorRect = this.quill.root.getBoundingClientRect();

    if (editorWidth < bounds.left + this.pickerWidth - this.pickerWidthOffset - this.editorLeftOffset) {
      this.pickerLeft = bounds.left - this.pickerWidth;
    } else {
      this.pickerLeft = bounds.left;
    }

    const bottom = bounds.top + editorRect.top + this.pickerHeight + appBarHeight;

    if (bottom > window.innerHeight) {
      this.pickerTop = bounds.top - this.pickerHeight - this.pickerBottomOffset;
    } else {
      this.pickerTop = bounds.top + this.pickerTopOffset;
    }
  }

  handleTextChange(_delta: Delta, _oldDelta: Delta, source: typeof Quill.sources) {
    if (source !== (Quill.sources.USER as unknown as typeof Quill.sources)) {
      return;
    }
    setTimeout(() => {
      this.currentRange = this.quill.getSelection() ?? defaultRange;
    }, 10);
  }

  addToolbarButtonClickHandler() {
    const button = this.quill.container.parentElement!.querySelector(".ql-emoji") as HTMLButtonElement | null;
    if (!button) {
      throw new Error("Please ensure that the emoji button is present in the toolbar");
    }
    button.addEventListener("click", () => {
      this.currentRange = this.quill.getSelection() ?? defaultRange;
      this.setPickerPosition();
      this.picker.style.left = `${this.pickerLeft}px`;
      this.picker.style.top = `${this.pickerTop}px`;
      this.picker.style.display = this.picker.style.display === "none" ? "block" : "none";
    });
  }

  addWindowClickHandler(event: MouseEvent | TouchEvent) {
    const target = event.target as Element;
    // if the target is the emoji picker toggle button then we want to show it
    if (target.closest(".ql-emoji")) {
      return;
    }
    // hide the picker if it is shown and the user clicks outside of it
    if (target.tagName !== "EM-EMOJI-PICKER") {
      this.hidePicker();
    }
  }

  addWindowKeyupHandler(event: KeyboardEvent) {
    if (event.key !== "Escape") {
      return;
    }
    this.hidePicker();
    this.quill.setSelection(this.currentRange.index, 0);
  }

  addHandlers() {
    this.addToolbarButtonClickHandler();
    window.addEventListener("click", this.addWindowClickHandler);
    window.addEventListener("keyup", this.addWindowKeyupHandler);
    window.addEventListener("unload", () => {
      window.removeEventListener("click", this.addWindowClickHandler);
      window.removeEventListener("keyup", this.addWindowKeyupHandler);
    });
  }
}
