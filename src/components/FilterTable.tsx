import type { FilterInterval } from '../types';
import { formatInterval } from '../utils/formatTime';
import { StatusBadge } from './StatusBadge';

interface FilterTableProps {
  filters: FilterInterval[];
}

export function FilterTable({ filters }: FilterTableProps) {
  if (filters.length === 0) {
    return (
      <p className="text-sm text-ink-500">No timestamp filters configured.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-ink-50 text-ink-500">
          <tr>
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">Interval</th>
            <th className="px-3 py-2 font-medium">Action</th>
            <th className="px-3 py-2 font-medium">Label</th>
          </tr>
        </thead>
        <tbody>
          {filters.map((filter) => (
            <tr key={filter.id} className="border-t border-ink-100">
              <td className="px-3 py-2 font-mono text-xs text-ink-700">
                {filter.id}
              </td>
              <td className="px-3 py-2 tabular-nums text-ink-900">
                {formatInterval(filter.start, filter.end)}
                <span className="ml-2 text-xs text-ink-500">
                  ({filter.start}s–{filter.end}s)
                </span>
              </td>
              <td className="px-3 py-2">
                <StatusBadge
                  tone={filter.action === 'mute' ? 'warn' : 'ok'}
                  label={filter.action}
                />
              </td>
              <td className="px-3 py-2 text-ink-700">
                {filter.label || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
