import "./app-bar.scss";

import { FC, useState } from "react";
import { Button, MenuList, MenuListItem, AppBar as R95AppBar, Toolbar } from "react95";

import { downloadPdf } from "utils";

interface AppBarProps {}

const AppBar: FC<AppBarProps> = () => {
  const [isFileOpen, setIsFileOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleSave = async () => {
    const element = document.querySelector(".ql-editor");
    if (!element) {
      return;
    }
    downloadPdf(element as HTMLElement);
    setIsFileOpen(false);
  };

  return (
    <div className="app-bar">
      <R95AppBar position="fixed">
        <Toolbar noPadding>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Button id="file-btn" active={isFileOpen} onClick={() => setIsFileOpen(!isFileOpen)}>
              File
            </Button>
            {isFileOpen && (
              <MenuList
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                }}
              >
                <MenuListItem onClick={handleSave}>Download as PDF</MenuListItem>
              </MenuList>
            )}
            <Button id="settings-btn" active={isSettingsOpen} onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
              Settings
            </Button>
            {isSettingsOpen && (
              <MenuList
                style={{
                  position: "absolute",
                  top: "100%",
                  left: document.getElementById("settings-btn")?.offsetLeft ?? 0,
                }}
              >
                <MenuListItem>Change theme</MenuListItem>
              </MenuList>
            )}
          </div>
        </Toolbar>
      </R95AppBar>
    </div>
  );
};

export { AppBar };
