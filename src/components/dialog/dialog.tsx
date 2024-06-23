import "./dialog.scss";

import { FC, useEffect, useRef } from "react";
import { ScrollView, Window, WindowContent, WindowHeader } from "react95";

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

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      hideDialog();
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // ignore right click
    if (event.button === 2) {
      return;
    }
    // do not drag if the user is attempting to drag using the close button
    // also hide the dialog
    if (!(event.target as HTMLElement).classList.contains("title")) {
      hideDialog();
      return;
    }
    canDrag = true;
    if (dialogWindowRef.current) {
      const rect = dialogWindowRef.current.getBoundingClientRect();
      topOffset = rect.top - event.clientY;
      leftOffset = rect.left - event.clientX;
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!canDrag) {
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
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
        <WindowHeader className="title" onMouseDown={handleMouseDown} onContextMenu={() => false}>
          {title}
          <CloseButton onClick={hideDialog} />
        </WindowHeader>
        <WindowContent className="window-content">
          <div className="root">
            <ScrollView className="body">{children}</ScrollView>
          </div>
        </WindowContent>
      </Window>
    </dialog>
  );
};

export default Dialog;
