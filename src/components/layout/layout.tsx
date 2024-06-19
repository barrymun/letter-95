import "./layout.scss";

import { FC, useEffect } from "react";

import { useTheme } from "hooks";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.desktopBackground;
  }, [theme]);

  return <div className="layout">{children}</div>;
};

export { Layout };
