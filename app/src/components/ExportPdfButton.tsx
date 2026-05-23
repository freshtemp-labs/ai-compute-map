/**
 * @file components/ExportPdfButton.tsx
 * @description 可复用的 PDF 导出按钮组件，带进度条指示器。
 *   捕获指定 DOM 元素的内容并生成可下载的 PDF 报告。
 * @dependencies lucide-react, @/utils/exportPdf
 */

import { useState, useCallback } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { exportToPdf } from '@/utils/exportPdf';

/** ExportPdfButton 组件 Props */
interface ExportPdfButtonProps {
  /** 要截取的 DOM 元素 ref */
  targetRef: React.RefObject<HTMLElement | null>;
  /** 导出文件名 */
  filename?: string;
  /** 按钮标签文本 */
  label?: string;
  /** 额外 CSS 类名 */
  className?: string;
}

/**
 * PDF 导出按钮组件
 * 点击后捕获 targetRef 指向的 DOM 元素，生成 PDF 并触发浏览器下载
 * @param targetRef - 截取目标的 ref
 * @param filename - 输出 PDF 文件名
 * @param label - 按钮显示文本
 * @param className - 额外样式
 * @returns PDF 导出按钮
 */
export default function ExportPdfButton({
  targetRef,
  filename = 'ai-compute-map-report',
  label = '导出 PDF 报告',
  className = '',
}: ExportPdfButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = useCallback(async () => {
    if (!targetRef.current || exporting) return;
    setExporting(true);
    setProgress(0);

    try {
      await exportToPdf({
        element: targetRef.current,
        filename,
        orientation: 'landscape',
        onProgress: setProgress,
      });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  }, [targetRef, filename, exporting]);

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleExport}
        disabled={exporting}
        className={`flex items-center gap-2 px-4 py-2 text-mono-sm border border-border-subtle rounded-lg transition-all duration-200 cursor-pointer ${
          exporting
            ? 'text-accent-cyan border-accent-cyan bg-[rgba(0,212,255,0.08)]'
            : 'text-text-secondary hover:text-text-primary hover:border-accent-cyan'
        } ${className}`}
      >
        {exporting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <FileDown size={14} />
        )}
        {exporting ? `导出中 ${progress}%` : label}
      </button>

      {/* Progress bar overlay */}
      {exporting && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1E28] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-cyan transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
