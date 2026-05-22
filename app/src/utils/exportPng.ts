/**
 * @file utils/exportPng.ts
 * @description PNG export utility using html2canvas.
 * Captures a DOM element and generates a downloadable PNG image.
 */

import html2canvas from 'html2canvas';

export interface ExportPngOptions {
  /** The DOM element to capture */
  element: HTMLElement;
  /** Output filename (without .png extension) */
  filename?: string;
  /** Scale factor for higher resolution output */
  scale?: number;
  /** Callback for progress updates (0-100) */
  onProgress?: (progress: number) => void;
  /** Background color to use if element is transparent */
  backgroundColor?: string;
}

/**
 * Export a DOM element as a PNG file.
 * Uses html2canvas to rasterize the element into a canvas,
 * then triggers a download.
 */
export async function exportToPng(options: ExportPngOptions): Promise<void> {
  const {
    element,
    filename = 'ai-compute-map-export',
    scale = 2,
    onProgress,
    backgroundColor = '#0A0A0F',
  } = options;

  onProgress?.(10);

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  onProgress?.(70);

  // Convert to blob for more reliable download
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to create PNG blob'));
      },
      'image/png',
      1.0
    );
  });

  onProgress?.(90);

  // Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  onProgress?.(100);
}

/**
 * Export type for selecting what portion to capture.
 */
export type ExportScope = 'fullpage' | 'map-only' | 'charts-only';

/**
 * Resolve the DOM element to capture based on export scope.
 */
export function getExportElement(scope: ExportScope): HTMLElement | null {
  switch (scope) {
    case 'fullpage':
      return document.getElementById('root') || document.body;
    case 'map-only':
      return document.getElementById('map-container')?.parentElement || null;
    case 'charts-only':
      return document.querySelector('[data-export="charts"]') as HTMLElement || null;
    default:
      return null;
  }
}
