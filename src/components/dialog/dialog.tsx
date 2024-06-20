import "./dialog.scss";

import { FC, useEffect, useRef } from "react";
import { Button, ScrollView, Window, WindowContent } from "react95";

interface DialogProps {
  show: boolean;
  setShow: (_: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const Dialog: FC<DialogProps> = (props) => {
  const { show, setShow, title, children } = props;

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
              <Button className="close" onClick={hideDialog}>
                Close
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
