/**
 * get all mentions from a html string
 * return the mention ids
 */
export function extractMentionedUsers(htmlString: string): string[] {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  // get all the mentions
  const mentionElements = tempDiv.querySelectorAll(".mention");
  const userIds: string[] = [];
  // get the value from the "data-value" attribute
  mentionElements.forEach((element) => {
    const value = element.getAttribute("data-value");
    if (value) {
      userIds.push(value);
    }
  });
  return userIds;
}
