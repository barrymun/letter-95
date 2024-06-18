import "./app-bar.scss";

import { FC, useState } from "react";
import { Button, MenuList, MenuListItem, AppBar as R95AppBar, Toolbar } from "react95";

import { useEditor, useLocalStorage } from "hooks";
import { LocalStorageKeys } from "utils";

interface AppBarProps {}

const AppBar: FC<AppBarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { editorHTML } = useEditor();
  const { setValue } = useLocalStorage();

  const handleSave = () => {
    setIsOpen(false);
    setValue(LocalStorageKeys.EditorHTML, editorHTML);
  };

  return (
    <div className="app-bar">
      <R95AppBar position="fixed">
        <Toolbar noPadding>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Button active={isOpen} onClick={() => setIsOpen(!isOpen)}>
              File
            </Button>
            {isOpen && (
              <MenuList
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                }}
              >
                <MenuListItem onClick={handleSave}>Save</MenuListItem>
              </MenuList>
            )}
          </div>
        </Toolbar>
      </R95AppBar>
    </div>
  );
};

export { AppBar };
