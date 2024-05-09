import Quill, { QuillOptions, Range } from "quill";
import { Delta } from "quill/core";

import { appBarHeight } from "utils";
import { menuClassName } from "utils/quill";
import { triggerCharacter as emojiTriggerCharacter } from "utils/quill/modules/custom-emoji/consts";
import { triggerCharacter as mentionTriggerCharacter } from "utils/quill/modules/mention/consts";
import { containsSpecialChars, countWhiteSpaces, getLastWord } from "utils/quill/modules/mention/helpers";
import { MenuOption } from "utils/quill/types";

const scrollOpts: ScrollIntoViewOptions = {
  behavior: "instant",
  block: "nearest",
};

export abstract class Menu {
  readonly menuTopOffset: number = 34;

  readonly menuBottomOffset: number = 6;

  readonly menuWidth: number = 160;

  readonly menuWidthOffset: number = 15; // additional offset to account for viewport padding

  readonly menuHeight: number = 140;

  readonly minLookaheadLength: number = 2;

  public data: MenuOption[] = [];

  public editorLeftOffset: number = 0; // account for editors with reduced width

  protected quill: Quill;

  protected menu: HTMLDivElement;

  protected menuLeft: number = 0;

  protected menuTop: number = 0;

  protected filterText = "";

  protected triggerCharacter!: typeof mentionTriggerCharacter | typeof emojiTriggerCharacter;

  protected cursorPosition: Range | null = null;

  protected insertAtPosition: Range | null = null;

  protected selectedIndex: number | null = null;

  constructor(quill: Quill, _options: QuillOptions) {
    this.getBounds = this.getBounds.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
    this.createMenu = this.createMenu.bind(this);
    this.isMenuOpen = this.isMenuOpen.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.preInsert = this.preInsert.bind(this);
    this.postInsert = this.postInsert.bind(this);
    this.insertItem = this.insertItem.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.getTextBeforeCursor = this.getTextBeforeCursor.bind(this);
    this.setMenuPosition = this.setMenuPosition.bind(this);
    this.handleMenuOps = this.handleMenuOps.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.downHandler = this.downHandler.bind(this);
    this.upHandler = this.upHandler.bind(this);

    this.quill = quill;

    this.menu = this.createMenu();

    this.quill.on("text-change", this.handleTextChange);
    this.quill.on("selection-change", this.handleSelectionChange);

    this.quill.keyboard.addBinding({ key: "Enter" }, this.selectHandler.bind(this));
    this.quill.keyboard.bindings.Enter.unshift(this.quill.keyboard.bindings.Enter.pop()!);

    this.quill.keyboard.addBinding({ key: "Tab" }, this.selectHandler.bind(this));
    this.quill.keyboard.bindings.Tab.unshift(this.quill.keyboard.bindings.Tab.pop()!);

    this.quill.keyboard.addBinding({ key: "ArrowDown" }, this.downHandler.bind(this));
    this.quill.keyboard.addBinding({ key: "ArrowUp" }, this.upHandler.bind(this));
  }

  getBounds() {
    return this.quill.getBounds(this.quill.getSelection() ?? 0)!;
  }

  abstract getFilteredData(): MenuOption[];

  createMenu() {
    const div = document.createElement("div");
    div.className = menuClassName;
    div.style.display = "none";
    div.style.width = `${this.menuWidth}px`;
    div.style.height = `${this.menuHeight}px`;
    this.quill.container.appendChild(div);
    return div;
  }

  isMenuOpen() {
    return this.menu.style.display !== "none";
  }

  hideMenu() {
    this.filterText = "";
    this.selectedIndex = null;
    this.menu.scrollTop = 0; // scroll to the top when the menu is hidden so the user starts at the same place
    this.menu.style.display = "none";
  }

  preInsert() {
    if (!this.cursorPosition || !this.insertAtPosition) {
      return;
    }
    // important to set this otherwise consecutive trigger chars will cause problems
    this.quill.setSelection(null);
    this.quill.deleteText(
      this.insertAtPosition.index,
      this.cursorPosition.index - this.insertAtPosition.index,
      Quill.sources.USER,
    );
  }

  postInsert() {
    const bounds = this.getBounds();
    if (bounds.bottom > this.quill.container.clientHeight) {
      this.quill.container.scrollTop += bounds.bottom - this.quill.container.clientHeight;
    }
    this.hideMenu();
  }

  abstract insertItem(option: MenuOption): void;

  showMenu(lastWord: string) {
    // reset on user input
    this.selectedIndex = null;

    let filterText = lastWord;
    if (filterText.startsWith(this.triggerCharacter)) {
      filterText = filterText.substring(1);
    }
    filterText = filterText.toLowerCase();
    this.filterText = filterText;

    // only want to allow one white space when searching (surnames)
    const whiteSpaceCount = countWhiteSpaces(lastWord);
    if (whiteSpaceCount > 1) {
      this.hideMenu();
      return;
    }

    // hide the menu on certain typed chars
    const hasSpecialChar = containsSpecialChars(lastWord);
    if (hasSpecialChar) {
      this.hideMenu();
      return;
    }

    // don't show the menu if there are no options to select
    const filteredData = this.getFilteredData();
    if (filteredData.length === 0) {
      this.hideMenu();
      return;
    }

    // don't show the menu if the emoji trigger is used until at least "x" chars are typed
    if (this.triggerCharacter === emojiTriggerCharacter) {
      if (lastWord.replace(this.triggerCharacter, "").length < this.minLookaheadLength) {
        this.hideMenu();
        return;
      }
    }

    // logic to show the menu
    this.menu.style.top = `${this.menuTop}px`;
    this.menu.style.left = `${this.menuLeft}px`;
    this.menu.style.display = "grid";
    this.menu.innerHTML = "";

    for (const [index, datum] of filteredData.entries()) {
      const div = document.createElement("div");
      if ((datum as unknown as MenuOption).description) {
        div.innerHTML = `
          <span class="label">${datum.label}</span>
          <span class="description">${(datum as unknown as MenuOption).description}</span>
        `;
      } else {
        div.innerText = datum.label;
      }
      div.onclick = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        this.insertItem(datum);
      };
      div.onmouseenter = (event: MouseEvent) => {
        event.preventDefault();
        if (this.selectedIndex !== null) {
          (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.remove("active");
        }
        this.selectedIndex = index;
        (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.add("active");
      };
      div.onmouseleave = (event: MouseEvent) => {
        event.preventDefault();
        if (this.selectedIndex !== null) {
          (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.remove("active");
        }
      };
      this.menu.appendChild(div);
    }

    // highlight the first child in the array (if it exists)
    if (this.menu.childNodes.length > 0) {
      this.selectedIndex = 0;
      (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.add("active");
    }
  }

  /**
   * when getting the text before the cursor we only want to examine the last data as opposed to all the text.
   * this way we won't get scenarios where multiple triggers already exist in the editor and our menu
   * won't appear/disappear at the correct times
   */
  getTextBeforeCursor(rangeIndex: Range["index"]): string {
    try {
      const delta = this.quill.getContents(0, rangeIndex);
      let textBeforeCursor: string | object =
        (delta?.ops && delta.ops.length) > 0 ? delta?.ops[delta.ops.length - 1]?.insert ?? "" : "";
      if (typeof textBeforeCursor === "object") {
        textBeforeCursor = "";
      }
      return textBeforeCursor;
    } catch (error) {
      return "";
    }
  }

  /**
   * check the bounds of the editor so the menu doesn't get cut off.
   * (floats left instead of right when closer to the right of the window)
   * (floats above instead of below when closer to the bottom of the window)
   */
  setMenuPosition() {
    const editorWidth = this.quill.root.offsetWidth;
    const bounds = this.getBounds();
    const editorRect = this.quill.root.getBoundingClientRect();

    if (editorWidth < bounds.left + this.menuWidth - this.menuWidthOffset - this.editorLeftOffset) {
      this.menuLeft = bounds.left - this.menuWidth;
    } else {
      this.menuLeft = bounds.left;
    }

    const menuBottom = bounds.top + editorRect.top + this.menuHeight + appBarHeight;

    if (menuBottom > window.innerHeight) {
      this.menuTop = bounds.top - this.menuHeight - this.menuBottomOffset;
    } else {
      this.menuTop = bounds.top + this.menuTopOffset;
    }
  }

  handleMenuOps({
    cursorPosition,
    textBeforeCursor,
    lastWord,
  }: {
    cursorPosition: Range;
    textBeforeCursor: string;
    lastWord: string;
  }) {
    const lastTypedChar = textBeforeCursor.slice(-1);
    if (lastTypedChar === this.triggerCharacter) {
      this.insertAtPosition = { ...cursorPosition, index: cursorPosition.index - 1 };
      this.setMenuPosition();
    }
    this.cursorPosition = cursorPosition;
    this.showMenu(lastWord);
  }

  /**
   * ensure to wrap this function call with a small timeout to ensure the cursor position is correct
   * thread: https://github.com/quilljs/quill/issues/1763
   */
  handleChange() {
    const cursorPosition = this.quill.getSelection();
    if (!cursorPosition || cursorPosition.index <= 0) {
      this.hideMenu();
      return;
    }
    const textBeforeCursor = this.getTextBeforeCursor(cursorPosition.index);
    const lastWord = getLastWord(textBeforeCursor, this.triggerCharacter);
    if (lastWord.includes(this.triggerCharacter)) {
      this.handleMenuOps({
        cursorPosition,
        textBeforeCursor,
        lastWord,
      });
      return;
    }
    this.hideMenu();
  }

  handleTextChange(_delta: Delta, _oldDelta: Delta, source: typeof Quill.sources) {
    if (source !== (Quill.sources.USER as unknown as typeof Quill.sources)) {
      return;
    }
    setTimeout(() => this.handleChange(), 10);
  }

  handleSelectionChange(range: Range | null, _oldRange: Range | null, _source: typeof Quill.sources) {
    if (range && range.length === 0) {
      setTimeout(() => this.handleChange(), 10);
    } else {
      this.hideMenu();
    }
  }

  selectHandler() {
    if (!this.isMenuOpen()) {
      return true; // use default key bindings
    }
    if (this.selectedIndex === null) {
      return true; // use default key bindings
    }
    const filteredData = this.getFilteredData();
    if (filteredData.length < this.selectedIndex - 1) {
      return true; // use default key bindings
    }
    const datum = filteredData[this.selectedIndex];
    this.insertItem(datum);
    return false;
  }

  downHandler() {
    if (!this.isMenuOpen()) {
      return true; // use default key bindings
    }
    if (this.menu.childNodes.length === 0) {
      this.selectedIndex = null;
      return true; // use default key bindings
    }
    if (this.selectedIndex === null || this.selectedIndex === this.menu.childNodes.length - 1) {
      if (this.selectedIndex !== null) {
        (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.remove("active");
      }
      this.selectedIndex = 0;
      (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.add("active");
    } else {
      (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.remove("active");
      this.selectedIndex += 1;
      (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.add("active");
    }
    (this.menu.childNodes[this.selectedIndex] as HTMLElement).scrollIntoView(scrollOpts);
    return false;
  }

  upHandler() {
    if (!this.isMenuOpen()) {
      return true; // use default key bindings
    }
    if (this.menu.childNodes.length === 0) {
      this.selectedIndex = null;
      return true; // use default key bindings
    }
    if (this.selectedIndex === null || this.selectedIndex === 0) {
      if (this.selectedIndex !== null) {
        (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.remove("active");
      }
      this.selectedIndex = this.menu.childNodes.length - 1;
      (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.add("active");
    } else {
      (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.remove("active");
      this.selectedIndex -= 1;
      (this.menu.childNodes[this.selectedIndex] as HTMLElement).classList.add("active");
    }
    (this.menu.childNodes[this.selectedIndex] as HTMLElement).scrollIntoView(scrollOpts);
    return false;
  }
}
