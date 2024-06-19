import "./app-bar.scss";

import { FC, lazy, useState } from "react";
import { Button, MenuList, MenuListItem, AppBar as R95AppBar, Toolbar } from "react95";
import themes from "react95/dist/themes";

import { useTheme } from "hooks";
import { downloadPdf } from "utils";

const Dialog = lazy(() => import("components/dialog/dialog"));

interface AppBarProps {}

const AppBar: FC<AppBarProps> = () => {
  const { setTheme } = useTheme();

  const [showDialog, setShowDialog] = useState<boolean>(false);
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

  const handleChangeTheme = () => {
    setIsSettingsOpen(false);
    setShowDialog(true);
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
                <MenuListItem onClick={handleChangeTheme}>Change theme</MenuListItem>
              </MenuList>
            )}
          </div>
        </Toolbar>
      </R95AppBar>
      <Dialog show={showDialog} setShow={setShowDialog} title="Select a theme">
        {Object.entries(themes).map(([name, theme], index) => (
          <div key={index} className="theme">
            <Button onClick={() => setTheme(theme)} style={{ backgroundColor: theme.material }}>
              {name}
            </Button>
          </div>
        ))}
      </Dialog>
    </div>
  );
};

export { AppBar };
