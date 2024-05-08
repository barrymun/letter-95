export function getLastWord(sentence: string, character: string) {
  // find the last occurrence of the character
  const lastIndex = sentence.lastIndexOf(character);
  if (lastIndex === -1) {
    return "";
  }
  const word = sentence.substring(lastIndex);
  if (word.startsWith(`${character} `)) {
    return word.replace(`${character} `, "");
  }
  return word;
}

export function countWhiteSpaces(str: string) {
  return (str.match(/\s/g) || []).length;
}

/**
 * hide the menu if any of these special chars are typed or if any numbers are typed
 */
export function containsSpecialChars(str: string) {
  const specialCharsRegex = /[?!,.()\d]/;
  return specialCharsRegex.test(str);
}
