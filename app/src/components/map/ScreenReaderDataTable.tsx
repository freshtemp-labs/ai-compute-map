/**
 * @file ScreenReaderDataTable.tsx
 * @description Screen-reader-friendly data table that renders facility data
 * in an accessible HTML table. Visually hidden but available to assistive tech.
 * Provides an equivalent experience for screen reader users who cannot use the
 * visual map.
 */
import { useMemo } from 'react';
import type { MapPin } from './useMapData';

interface ScreenReaderDataTableProps {
  pins: MapPin[];
}

function formatValue(pin: MapPin): string {
  if (typeof pin.value === 'number') {
    if (pin.value >= 1000) return `${(pin.value / 1000).toFixed(1)}K ${pin.unit || ''}`;
    return `${pin.value} ${pin.unit || ''}`;
  }
  return `${pin.value} ${pin.unit || ''}`;
}

export default function ScreenReaderDataTable({ pins }: ScreenReaderDataTableProps) {
  const sortedPins = useMemo(
    () => [...pins].sort((a, b) => a.layer.localeCompare(b.layer) || a.name.localeCompare(b.name)),
    [pins]
  );

  return (
    <section
      className="sr-only"
      aria-label="Facility data table for screen readers"
      role="region"
    >
      <h2>AI Compute Map Facility Data</h2>
      <p>
        This table contains {sortedPins.length} facilities across supply chain,
        foundry, and data center categories.
      </p>
      <table role="table" aria-label="Complete list of AI compute facilities">
        <caption>
          AI Compute Infrastructure Facilities — {sortedPins.length} entries
        </caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Layer</th>
            <th scope="col">Location</th>
            <th scope="col">Value</th>
            <th scope="col">Status</th>
            <th scope="col">Data Source</th>
            <th scope="col">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {sortedPins.map((pin) => {
            const layerLabel =
              pin.layer === 'supply'
                ? 'Supply Chain'
                : pin.layer === 'foundry'
                ? 'Foundry'
                : 'Data Center';
            const location = [pin.city, pin.country].filter(Boolean).join(', ') || 'Unknown';
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
