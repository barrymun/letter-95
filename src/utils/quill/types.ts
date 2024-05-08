// going off older v1.3.7 version: https://github.com/quilljs/quill/blob/v1.3.7/modules/keyboard.js#L129
export enum Keys137 {
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  ESCAPE = 27,
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  DELETE = 46,
}

export interface MenuOption {
  label: string;
  value: string;
  description?: string;
}
