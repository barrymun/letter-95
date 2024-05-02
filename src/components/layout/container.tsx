import "./container.scss";

import { FC } from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return <div className="container">{children}</div>;
};

export { Container };
