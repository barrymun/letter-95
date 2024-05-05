import "./layout.scss";

import { FC, useEffect } from "react";
import { Theme } from "react95/dist/types";
import { useTheme } from "styled-components";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { desktopBackground } = useTheme() as Theme;

  useEffect(() => {
    document.body.style.backgroundColor = desktopBackground;
  }, []);

  return <div className="layout">{children}</div>;
};

export { Layout };
