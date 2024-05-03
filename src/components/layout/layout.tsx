import "./container.scss";

import { FC } from "react";
import { Theme } from "react95/dist/types";
import { useTheme } from "styled-components";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { desktopBackground } = useTheme() as Theme;

  return (
    <div
      style={{
        backgroundColor: desktopBackground,
      }}
    >
      {children}
    </div>
  );
};

export { Layout };
