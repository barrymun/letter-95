import "./presentational.scss";

import { FC } from "react";
import { Button } from "react95";

import { Close } from "components/svgs";
import { useTheme } from "hooks";

interface InfoProps {
  onClick: () => void;
}

const CloseButton: FC<InfoProps> = ({ onClick }) => {
  const { theme } = useTheme();

  return (
    <Button className="close" style={{ backgroundColor: theme.material, color: theme.materialText }} onClick={onClick}>
      <Close width={12} />
    </Button>
  );
};

export { CloseButton };
