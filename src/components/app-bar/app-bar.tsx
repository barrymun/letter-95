import "./app-bar.scss";

import { FC, lazy, useState } from "react";
import { Button, MenuList, MenuListItem, AppBar as R95AppBar, Separator, Toolbar } from "react95";
import themes from "react95/dist/themes";
import { Theme } from "react95/dist/types";

import { GitHub } from "components/svgs";
import { useEditor, useLocalStorage, useTheme } from "hooks";
import { LocalStorageKeys, downloadPdf, projectGitHubUrl } from "utils";

const Dialog = lazy(() => import("components/dialog/dialog"));

interface AppBarProps {}

const AppBar: FC<AppBarProps> = () => {
  const { setValue } = useLocalStorage();
  const { setTheme } = useTheme();
  const { setShouldClear } = useEditor();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isFileOpen, setIsFileOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleClear = () => {
    setShouldClear(true);
    setIsFileOpen(false);
  };

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

  const handleClick = (theme: Theme) => () => {
    setTheme(theme);
    setValue(LocalStorageKeys.Theme, JSON.stringify(theme));
    setShowDialog(false);
  };

  const linkToGitHub = () => {
    window.open(projectGitHubUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app-bar">
      <R95AppBar position="fixed">
        <Toolbar noPadding className="toolbar">
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
                <MenuListItem onClick={handleClear}>Clear</MenuListItem>
                <Separator />
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
          <div className="github" role="presentation" onClick={linkToGitHub}>
            <GitHub width={24} />
          </div>
        </Toolbar>
      </R95AppBar>
      <Dialog show={showDialog} setShow={setShowDialog} title="Select a theme">
        {Object.entries(themes).map(([name, theme], index) => (
          <div key={index} className="theme">
            <Button onClick={handleClick(theme)} style={{ backgroundColor: theme.material, color: theme.materialText }}>
              {name}
            </Button>
          </div>
        ))}
      </Dialog>
    </div>
  );
};

export { AppBar };
