import "./dialog.scss";

import { FC, useEffect, useRef } from "react";
import { Button, ScrollView, Window, WindowContent } from "react95";

import { Close } from "components/svgs";
import { useTheme } from "hooks";

interface DialogProps {
  show: boolean;
  setShow: (_: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const Dialog: FC<DialogProps> = (props) => {
  const { show, setShow, title, children } = props;

  const { theme } = useTheme();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const showDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.showModal();
    setShow(true);
  };

  const hideDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.close();
    setShow(false);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      hideDialog();
    }
  };

  useEffect(() => {
    if (show) {
      showDialog();
    } else {
      hideDialog();
    }
  }, [show]);

  /**
   * close the dialog when the user presses the escape key
   */
  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <dialog className="dialog" ref={dialogRef}>
      <Window>
        <WindowContent>
          <div className="root">
            <div className="title">
              {title}
              <Button
                className="close"
                style={{ backgroundColor: theme.material, color: theme.materialText }}
                onClick={hideDialog}
              >
                <Close width={12} />
              </Button>
            </div>
            <ScrollView className="body">{children}</ScrollView>
          </div>
        </WindowContent>
      </Window>
    </dialog>
  );
};

export default Dialog;
