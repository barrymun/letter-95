import Quill from "quill";

import { triggerCharacter } from "utils/quill/modules/custom-emoji/consts";
import { Menu } from "utils/quill/modules/menu/menu";
import { MenuOption } from "utils/quill/types";

export class CustomEmoji extends Menu {
  protected triggerCharacter = triggerCharacter;

  getFilteredData(): MenuOption[] {
    return this.data.filter((d) => d.label.toLowerCase().includes(this.filterText));
  }

  insertItem(option: MenuOption): void {
    if (!this.cursorPosition || !this.insertAtPosition) {
      return;
    }
    this.preInsert();
    const textToInsert = option.value;
    this.quill.insertText(this.insertAtPosition.index, textToInsert);
    this.quill.setSelection(this.insertAtPosition.index + textToInsert.length, Quill.sources.USER);
    this.postInsert();
  }
}
