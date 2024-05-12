import "./app-bar.scss";

import { FC, useState } from "react";
import { Button, MenuList, MenuListItem, AppBar as R95AppBar, Toolbar } from "react95";

interface AppBarProps {}

const AppBar: FC<AppBarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="app-bar">
      <R95AppBar position="fixed">
        <Toolbar>
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
                <MenuListItem>Save</MenuListItem>
              </MenuList>
            )}
          </div>
        </Toolbar>
      </R95AppBar>
    </div>
  );
};

export { AppBar };
