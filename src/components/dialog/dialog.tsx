import "./dialog.scss";

import { FC, useEffect, useRef } from "react";
import { ScrollView, Window, WindowContent } from "react95";

import { CloseButton } from "components/presentational";

let canDrag = false;
let topOffset = 0;
let leftOffset = 0;

interface DialogProps {
  show: boolean;
  setShow: (_: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const Dialog: FC<DialogProps> = (props) => {
  const { show, setShow, title, children } = props;

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const dialogWindowRef = useRef<HTMLDivElement | null>(null);

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // ignore right click
    if (e.button === 2) {
      return;
    }
    canDrag = true;
    if (dialogWindowRef.current) {
      const rect = dialogWindowRef.current.getBoundingClientRect();
      topOffset = rect.top - e.clientY;
      leftOffset = rect.left - e.clientX;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canDrag) {
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    if (dialogWindowRef.current) {
      dialogWindowRef.current.style.left = `${x + leftOffset}px`;
      dialogWindowRef.current.style.top = `${y + topOffset}px`;
    }
  };

  const handleMouseUp = () => {
    canDrag = false;
    topOffset = 0;
    leftOffset = 0;
  };

  useEffect(() => {
    if (show) {
      showDialog();
    } else {
      hideDialog();
      dialogWindowRef.current?.removeAttribute("style");
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

  /**
   * user can drag the dialog (window) anywhere on the page
   */
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <dialog className="dialog" ref={dialogRef}>
      <Window className="window" ref={dialogWindowRef}>
        <WindowContent className="window-content">
          <div className="root">
            <div className="title" role="presentation" onMouseDown={handleMouseDown} onContextMenu={() => false}>
              {title}
              <CloseButton onClick={hideDialog} />
            </div>
            <ScrollView className="body">{children}</ScrollView>
          </div>
        </WindowContent>
      </Window>
    </dialog>
  );
};

export default Dialog;
