import emojiData from "@emoji-mart/data";
import * as EmojiMart from "emoji-mart";
import round from "lodash/round";
import Quill, { Delta, QuillOptions, Range } from "quill/core";

import { appBarHeight, defaultRange } from "utils/consts";
import { pickerClassName, pickerTagName } from "utils/quill/modules/custom-emoji-mart/consts";

export class CustomEmojiMart {
  readonly pickerTopOffset: number = 34;

  readonly pickerBottomOffset: number = 6;

  readonly pickerWidth: number = 352;

  readonly pickerWidthOffset: number = 15; // additional offset to account for viewport padding

  readonly pickerHeight: number = 435;

  public editorLeftOffset: number = 0; // account for editors with reduced width

  protected quill: Quill;

  protected picker: HTMLElement;

  protected pickerLeft: number = 0;

  protected pickerTop: number = 0;

  protected currentRange: Range = defaultRange;

  constructor(quill: Quill, _options: QuillOptions) {
    this.hidePicker = this.hidePicker.bind(this);
    this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
    this.createPicker = this.createPicker.bind(this);
    this.getBounds = this.getBounds.bind(this);
    this.getParsedPickerWidth = this.getParsedPickerWidth.bind(this);
    this.getParsedPickerHeight = this.getParsedPickerHeight.bind(this);
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
    // reset picker options if there were previous search results
    const pickerClearButton = this.picker.shadowRoot?.querySelector(
      "button[title='Clear']",
    ) as HTMLButtonElement | null;
    if (pickerClearButton) {
      pickerClearButton.click();
    }
  }

  handleEmojiSelect(emoji: { native: string }) {
    const textToInsert = emoji.native;
    this.quill.insertText(this.currentRange.index, textToInsert);
    this.quill.setSelection(this.currentRange.index + textToInsert.length, 0);
    this.hidePicker();
  }

  createPicker() {
    const maxWidth = this.quill.root.offsetWidth;
    const pickerOptions = {
      theme: "light",
      previewPosition: "none",
      data: emojiData,
      onEmojiSelect: this.handleEmojiSelect.bind(this),
      dynamicWidth: this.pickerWidth > maxWidth,
    };
    const pickerNode = new EmojiMart.Picker(pickerOptions) as unknown as HTMLElement;
    pickerNode.className = pickerClassName;
    pickerNode.style.display = "none";
    pickerNode.style.width = `${this.pickerWidth}px`;
    pickerNode.style.height = `${round(window.innerHeight / 2) - appBarHeight}px`;
    this.quill.container.appendChild(pickerNode);
    return pickerNode;
  }

  getBounds() {
    return this.quill.getBounds(this.quill.getSelection() ?? 0)!;
  }

  getParsedPickerWidth() {
    return round(parseInt(this.picker.style.width.replace("px", ""), 10));
  }

  getParsedPickerHeight() {
    return round(parseInt(this.picker.style.height.replace("px", ""), 10));
  }

  setPickerPosition() {
    const targetWidth = this.quill.root.offsetWidth;
    const targetHeight = round(window.innerHeight) - appBarHeight;
    const bounds = this.getBounds();
    const editorRect = this.quill.root.getBoundingClientRect();
    const parsedHeight = this.getParsedPickerHeight();

    if (targetWidth < bounds.left + this.pickerWidth - this.pickerWidthOffset - this.editorLeftOffset) {
      this.pickerLeft = bounds.left - this.pickerWidth;
    } else {
      this.pickerLeft = bounds.left;
    }
    if (this.pickerLeft < 0) {
      this.pickerLeft = 0;
    }

    const bottom = round(bounds.top + editorRect.top + parsedHeight);

    if (bottom > targetHeight) {
      this.pickerTop = bounds.top - this.pickerBottomOffset - parsedHeight;
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
      const maxWidth = this.quill.root.offsetWidth;
      const maxHeight = round(window.innerHeight / 2) - appBarHeight;
      const parsedWidth = this.getParsedPickerWidth();
      const parsedHeight = this.getParsedPickerHeight();

      this.currentRange = this.quill.getSelection() ?? defaultRange;
      this.setPickerPosition();
      this.picker.style.left = `${this.pickerLeft}px`;
      this.picker.style.top = `${this.pickerTop}px`;
      // ensure the picker does not exceed the width of the editor
      if (parsedWidth >= maxWidth) {
        this.picker.style.width = `${maxWidth}px`;
      } else {
        this.picker.style.width = `${this.pickerWidth}px`;
      }
      // ensure the picker does not exceed half the height of the viewport
      if (parsedHeight >= maxHeight) {
        this.picker.style.height = `${maxHeight}px`;
      } else {
        this.picker.style.height = `${this.pickerHeight}px`;
      }
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
    if (target.tagName !== pickerTagName) {
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
