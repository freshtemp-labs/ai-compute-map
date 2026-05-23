/**
 * @file components/ExportDataButton.tsx
 * @description 可复用的数据导出按钮组件。提供下拉菜单选择导出格式（CSV/JSON/Excel）
 *   和可选的范围过滤（全部/区域/图层）。
 * @dependencies lucide-react, @/utils/exportData
 */
import { useState, useCallback, useRef } from 'react';
import { Download, FileSpreadsheet, FileText, FileJson, ChevronDown, Loader2 } from 'lucide-react';
import { exportData, type ExportFormat, type ExportScope } from '@/utils/exportData';

/** ExportDataButton 组件 Props */
interface ExportDataButtonProps<T extends Record<string, unknown>> {
  /** 要导出的数据数组 */
  data: T[];
  /** 默认文件名（不含扩展名） */
  filename?: string;
  /** Excel 工作表名称 */
  sheetName?: string;
  /** 可选的范围过滤选项 */
  scopeOptions?: { label: string; value: string }[];
  /** 过滤范围类型 */
  scopeType?: ExportScope;
  /** 可导出字段（默认全部） */
  fields?: (keyof T)[];
  /** 按钮标签文本 */
  label?: string;
  /** 额外 CSS 类名 */
  className?: string;
}

/** 可选的导出格式列表 */
const FORMAT_OPTIONS: { format: ExportFormat; icon: React.ReactNode; label: string }[] = [
  { format: 'csv', icon: <FileText size={14} />, label: 'CSV' },
  { format: 'json', icon: <FileJson size={14} />, label: 'JSON' },
  { format: 'excel', icon: <FileSpreadsheet size={14} />, label: 'Excel' },
];

/**
 * 数据导出按钮组件
 * 支持 CSV/JSON/Excel 三种格式导出，可组合范围过滤器
 * @param data - 待导出的数据数组
 * @param filename - 导出文件名（不含扩展名）
 * @param sheetName - Excel 工作表名
 * @param scopeOptions - 范围过滤选项
 * @param scopeType - 过滤范围类型
 * @param fields - 可导出字段列表
 * @param label - 按钮标签
 * @param className - 额外样式类名
 * @returns 带下拉菜单的导出按钮
 */
export default function ExportDataButton<T extends Record<string, unknown>>({
  data,
  filename = 'ai-compute-map-export',
  sheetName = 'Data',
  scopeOptions,
  scopeType = 'all',
  fields,
  label,
  className = '',
}: ExportDataButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(
    (format: ExportFormat) => {
      setOpen(true);
      setExporting(true);

      try {
        exportData({
          data,
          format,
          scope: selectedScope === 'all' ? 'all' : scopeType,
          scopeValue: selectedScope === 'all' ? undefined : selectedScope,
          fields,
          filename: `${filename}-${new Date().toISOString().slice(0, 10)}`,
          sheetName,
        });
      } catch (err) {
        console.error('Export failed:', err);
      } finally {
        // Brief delay for UX feedback
        setTimeout(() => {
          setExporting(false);
          setOpen(false);
        }, 300);
      }
    },
    [data, filename, sheetName, selectedScope, scopeType, fields],
  );

  // Close dropdown on outside click
  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setOpen(false);
    }
  }, []);

  const hasScopeOptions = scopeOptions && scopeOptions.length > 0;

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      onBlur={handleBlur}
    >
      <button
        onClick={() => setOpen(!open)}
        disabled={exporting}
        className={`flex items-center gap-2 px-3 py-1.5 text-mono-sm text-text-secondary border border-border-subtle rounded-lg hover:border-accent-cyan hover:text-accent-cyan transition-all duration-200 cursor-pointer disabled:opacity-50 ${className}`}
      >
        {exporting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
        {label ?? '导出数据'}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-[#111118] border border-[#1E1E28] rounded-lg shadow-xl overflow-hidden z-50">
          {/* Scope selector */}
          {hasScopeOptions && (
            <div className="px-3 py-2 border-b border-[#1E1E28]">
              <label className="text-xs text-text-muted block mb-1">导出范围</label>
              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="w-full px-2 py-1.5 bg-[#1E1E28] border border-[#2A2A3A] rounded text-xs text-text-primary focus:outline-none focus:border-accent-cyan"
              >
                <option value="all">全部数据</option>
                {scopeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Format options */}
          <div className="py-1">
            {FORMAT_OPTIONS.map(({ format, icon, label: fmtLabel }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono text-[#9A9AAF] hover:text-[#E8E8EC] hover:bg-[#181820] transition-colors duration-150 cursor-pointer"
              >
                {icon}
                <span>导出为 {fmtLabel}</span>
                {selectedScope !== 'all' && (
                  <span className="ml-auto text-[10px] text-text-muted">
                    ({scopeOptions?.find((o) => o.value === selectedScope)?.label})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
