/**
 * @file ScreenReaderDataTable.tsx
 * @description Screen-reader-friendly data table that renders facility data
 * in an accessible HTML table. Visually hidden but available to assistive tech.
 * Provides an equivalent experience for screen reader users who cannot use the
 * visual map. Supports i18n for all text.
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MapPin } from './useMapData';

/**
 * ScreenReaderDataTable 组件属性
 */
interface ScreenReaderDataTableProps {
  /** 所有设施标注点数据 */
  pins: MapPin[];
}

/**
 * 格式化设施数值显示
 * 大于1000的数值显示为 K 格式
 * @param pin - 地图标注点
 * @returns 格式化后的数值字符串
 */
function formatValue(pin: MapPin): string {
  if (typeof pin.value === 'number') {
    if (pin.value >= 1000) return `${(pin.value / 1000).toFixed(1)}K ${pin.unit || ''}`;
    return `${pin.value} ${pin.unit || ''}`;
  }
  return `${pin.value} ${pin.unit || ''}`;
}

/**
 * 屏幕阅读器数据表组件
 * 在视觉上隐藏（sr-only）但对屏幕阅读器可访问的 HTML 表格，
 * 为无法使用可视地图的用户提供等效的数据体验
 * @param pins - 所有设施标注点数据
 * @returns 无障碍数据表格 JSX 元素
 */
export default function ScreenReaderDataTable({ pins }: ScreenReaderDataTableProps) {
  const { t } = useTranslation(['map', 'common']);
  const sortedPins = useMemo(
    () => [...pins].sort((a, b) => a.layer.localeCompare(b.layer) || a.name.localeCompare(b.name)),
    [pins]
  );

  const layerLabels: Record<string, string> = {
    supply: t('layerToggle.supplyChain', { ns: 'map', defaultValue: 'Supply Chain' }),
    foundry: t('layerToggle.foundry', { ns: 'map', defaultValue: 'Foundry' }),
    datacenter: t('layerToggle.dataCenter', { ns: 'map', defaultValue: 'Data Center' }),
  };

  return (
    <section
      className="sr-only"
      aria-label={t('map:a11y.dataTableSection', { defaultValue: 'Facility data table for screen readers' })}
      role="region"
    >
      <h2>{t('map:a11y.dataTableTitle', { defaultValue: 'AI Compute Map Facility Data' })}</h2>
      <p>
        {t('map:a11y.dataTableDesc', {
          count: sortedPins.length,
          defaultValue: `This table contains ${sortedPins.length} facilities across supply chain, foundry, and data center categories.`,
        })}
      </p>
      <table role="table" aria-label={t('map:a11y.dataTableLabel', { defaultValue: 'Complete list of AI compute facilities' })}>
        <caption>
          {t('map:a11y.dataTableCaption', {
            count: sortedPins.length,
            defaultValue: `AI Compute Infrastructure Facilities — ${sortedPins.length} entries`,
          })}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t('map:a11y.colName', { defaultValue: 'Name' })}</th>
            <th scope="col">{t('map:a11y.colCategory', { defaultValue: 'Category' })}</th>
            <th scope="col">{t('map:a11y.colLayer', { defaultValue: 'Layer' })}</th>
            <th scope="col">{t('map:a11y.colLocation', { defaultValue: 'Location' })}</th>
            <th scope="col">{t('map:a11y.colValue', { defaultValue: 'Value' })}</th>
            <th scope="col">{t('map:a11y.colStatus', { defaultValue: 'Status' })}</th>
            <th scope="col">{t('map:a11y.colSource', { defaultValue: 'Data Source' })}</th>
            <th scope="col">{t('map:a11y.colUpdated', { defaultValue: 'Last Updated' })}</th>
          </tr>
        </thead>
        <tbody>
          {sortedPins.map((pin) => {
            const layerLabel = layerLabels[pin.layer] || pin.layer;
            const location = [pin.city, pin.country].filter(Boolean).join(', ') || t('common:data.unknown', { defaultValue: 'Unknown' });
            const status = pin.status || 'N/A';
            return (
              <tr key={pin.id}>
                <td>{pin.name}</td>
                <td>{pin.category || pin.provider || pin.company || '-'}</td>
                <td>{layerLabel}</td>
                <td>{location}</td>
                <td>{formatValue(pin)}</td>
                <td>{status}</td>
                <td>{pin.sourceName}</td>
                <td>{pin.lastUpdated}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
