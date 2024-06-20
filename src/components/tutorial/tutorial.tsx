import "./tutorial.scss";

import { FC, useEffect, useState } from "react";
import { Window, WindowContent } from "react95";

import { CloseButton } from "components/presentational";
import { useLocalStorage } from "hooks";
import { LocalStorageKeys } from "utils";

interface InfoProps {}

const Tutorial: FC<InfoProps> = (_props) => {
  const { getValue, setValue } = useLocalStorage();

  const [isHidden, setIsHidden] = useState<boolean>(true);

  const handleClose = () => {
    setValue(LocalStorageKeys.HideTutorial, "true");
    setIsHidden(true);
  };

  useEffect(() => {
    const storedHideTutorial = getValue(LocalStorageKeys.HideTutorial);
    if (storedHideTutorial && storedHideTutorial === "true") {
      setIsHidden(true);
      return;
    }
    setIsHidden(false);
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <div className="tutorial">
      <Window>
        <WindowContent>
          <div className="content">
            Use @ to mention a user. Use : (with at least 2 characters typed) to insert an emoji.
            <CloseButton onClick={handleClose} />
          </div>
        </WindowContent>
      </Window>
    </div>
  );
};

export default Tutorial;
