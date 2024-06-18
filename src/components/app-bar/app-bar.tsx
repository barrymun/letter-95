import "./app-bar.scss";

import html2canvas from "html2canvas";
import { jsPDF as JSPDF } from "jspdf";
import { FC, useState } from "react";
import { Button, MenuList, MenuListItem, AppBar as R95AppBar, Toolbar } from "react95";

interface AppBarProps {}

const AppBar: FC<AppBarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSave = async () => {
    const element = document.querySelector(".ql-editor");
    if (!element) {
      return;
    }
    const canvas = await html2canvas(element as HTMLElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new JSPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("document.pdf");
    setIsOpen(false);
  };

  return (
    <div className="app-bar">
      <R95AppBar position="fixed">
        <Toolbar noPadding>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Button active={isOpen} onClick={() => setIsOpen(!isOpen)}>
              File
            </Button>
            {isOpen && (
              <MenuList
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                }}
              >
                <MenuListItem onClick={handleSave}>Download as PDF</MenuListItem>
              </MenuList>
            )}
          </div>
        </Toolbar>
      </R95AppBar>
    </div>
  );
};

export { AppBar };
