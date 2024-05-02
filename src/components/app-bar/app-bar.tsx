import "./app-bar.scss";

import { FC } from "react";
import { AppBar as R95AppBar } from "react95";

interface AppBarProps {}

const AppBar: FC<AppBarProps> = () => {
  return (
    <div className="app-bar">
      <R95AppBar>Here</R95AppBar>
    </div>
  );
};

export { AppBar };
