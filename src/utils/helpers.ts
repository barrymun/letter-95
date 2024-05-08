/**
 * get any user mentions from a html string
 * return the list of user ids and convert to numbers
 */
export function extractMentionedUsers(htmlString: string): number[] {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  // get all the mentions
  const mentionElements = tempDiv.querySelectorAll(".mention");
  const userIds: number[] = [];
  // get the value from the "data-value" attribute
  mentionElements.forEach((element) => {
    const value = element.getAttribute("data-value");
    if (value) {
      userIds.push(parseInt(value, 10));
    }
  });
  return userIds;
}
