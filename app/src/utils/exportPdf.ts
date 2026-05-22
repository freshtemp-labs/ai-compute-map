/**
 * @file utils/exportPdf.ts
 * @description PDF export utility using html2canvas + jsPDF.
 * Captures a DOM element (page content) and generates a downloadable PDF.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  /** The DOM element to capture */
  element: HTMLElement;
  /** Output filename (without .pdf extension) */
  filename?: string;
  /** PDF orientation */
  orientation?: 'portrait' | 'landscape';
  /** Callback for progress updates (0-100) */
  onProgress?: (progress: number) => void;
}

/**
 * Export a DOM element as a PDF file.
 * Splits tall content into multiple pages automatically.
 */
export async function exportToPdf(options: ExportPdfOptions): Promise<void> {
  const {
    element,
    filename = 'ai-compute-map-report',
    orientation = 'landscape',
    onProgress,
  } = options;

  onProgress?.(5);

  // Create canvas from the element
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#0A0A0F',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  onProgress?.(50);

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // A4 dimensions in points
  const pdfWidth = orientation === 'landscape' ? 842 : 595;
  const pdfHeight = orientation === 'landscape' ? 595 : 842;

  // Scale to fit width
  const scaleFactor = pdfWidth / imgWidth;
  const scaledHeight = imgHeight * scaleFactor;

  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: 'a4',
  });

  // If content fits on one page
  if (scaledHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
    onProgress?.(90);
  } else {
    // Multi-page: slice the canvas into page-sized chunks
    const pageCanvas = document.createElement('canvas');
    const pageCtx = pageCanvas.getContext('2d')!;
    const pageImgHeightPx = pdfHeight / scaleFactor;
    pageCanvas.width = imgWidth;
    pageCanvas.height = pageImgHeightPx;

    let yOffset = 0;
    let pageNum = 0;
    const totalPages = Math.ceil(imgHeight / pageImgHeightPx);

    while (yOffset < imgHeight) {
      if (pageNum > 0) pdf.addPage();

      pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(
        canvas,
        0, yOffset, imgWidth, pageImgHeightPx,
        0, 0, imgWidth, pageImgHeightPx,
      );

      const pageImgData = pageCanvas.toDataURL('image/png');
      const remainingHeight = imgHeight - yOffset;
      const drawHeight = Math.min(pageImgHeightPx, remainingHeight) * scaleFactor;

      pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, drawHeight);

      yOffset += pageImgHeightPx;
      pageNum++;
      onProgress?.(50 + Math.round((pageNum / totalPages) * 40));
    }
  }

  onProgress?.(95);

  // Add metadata footer to last page
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 175);
    pdf.text(
      `AI Compute Map Report — Page ${i}/${pageCount} — Generated ${new Date().toISOString().slice(0, 10)}`,
      orientation === 'landscape' ? 421 : 297.5,
      pdfHeight - 15,
      { align: 'center' },
    );
  }

  onProgress?.(100);

  pdf.save(`${filename}.pdf`);
}
