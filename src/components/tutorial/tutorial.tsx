import "./tutorial.scss";

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Window, WindowContent, WindowHeader } from "react95";

import { CloseButton } from "components/presentational";
import { useLocalStorage } from "hooks";
import { LocalStorageKeys } from "utils";

interface InfoProps {}

const Tutorial: FC<InfoProps> = (_props) => {
  const { t } = useTranslation();

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
        <WindowHeader className="title">
          {t("app-bar.tutorial.title")}
          <CloseButton onClick={handleClose} />
        </WindowHeader>
        <WindowContent>
          <div className="content">{t("app-bar.tutorial.content")}</div>
        </WindowContent>
      </Window>
    </div>
  );
};

export default Tutorial;
