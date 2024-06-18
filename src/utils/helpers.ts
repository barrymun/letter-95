import html2canvas from "html2canvas";
import { jsPDF as JSPDF } from "jspdf";

/**
 * get all mentions from a html string
 * return the mention ids
 */
export function extractMentionedUsers(htmlString: string): string[] {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  // get all the mentions
  const mentionElements = tempDiv.querySelectorAll(".mention");
  const userIds: string[] = [];
  // get the value from the "data-value" attribute
  mentionElements.forEach((element) => {
    const value = element.getAttribute("data-value");
    if (value) {
      userIds.push(value);
    }
  });
  return userIds;
}

/**
 * convert html element to pdf and then download it
 */
export async function downloadPdf(element: HTMLElement) {
  const canvas = await html2canvas(element as HTMLElement);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new JSPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("document.pdf");
}
