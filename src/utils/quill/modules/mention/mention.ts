import Quill from "quill";

import { extractMentionedUsers } from "utils/helpers";
import { MentionBlot } from "utils/quill/modules/mention/blot";
import { blotName, triggerCharacter } from "utils/quill/modules/mention/consts";
import { MentionEmbed } from "utils/quill/modules/mention/types";
import { Menu } from "utils/quill/modules/menu/menu";
import { MenuOption } from "utils/quill/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
Quill.register("blots/mention", MentionBlot as any);

export class Mention extends Menu {
  protected triggerCharacter = triggerCharacter;

  getFilteredData() {
    let res: MenuOption[];
    let mentionedUsers: ReturnType<typeof extractMentionedUsers> = [];

    res = this.data.filter((d) => d.label.toLowerCase().includes(this.filterText));
    // filter users that have already been mentioned as these should not appear in the menu once selected
    mentionedUsers = extractMentionedUsers(this.quill.root.innerHTML);
    if (mentionedUsers) {
      res = res.filter((d) => !mentionedUsers.map(String).includes(d.value));
    }
    return res;
  }

  insertItem(option: MenuOption) {
    if (!this.cursorPosition || !this.insertAtPosition) {
      return;
    }
    this.preInsert();
    const embed: MentionEmbed = { ...option, triggerCharacter: this.triggerCharacter };
    this.quill.insertEmbed(this.insertAtPosition.index, blotName, embed, Quill.sources.USER);
    this.quill.insertText(this.insertAtPosition.index + 1, " ", Quill.sources.USER); // adding a space after insertion
    this.quill.setSelection(this.insertAtPosition.index + 2, Quill.sources.USER); // set the cursor after the space
    this.postInsert();
  }
}
