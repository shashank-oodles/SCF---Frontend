import type { TitleFilterConfig } from '../types';
import { FilterTable } from './FilterTable';

interface TitleCardProps {
  config: TitleFilterConfig;
}

export function TitleCard({ config }: TitleCardProps) {
  const muteCount = config.filters.filter((f) => f.action === 'mute').length;
  const skipCount = config.filters.filter((f) => f.action === 'skip').length;

  return (
    <section className="rounded-xl border border-ink-200/80 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Configured title
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink-900">
            {config.title}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            ID: <code className="text-ink-700">{config.titleId}</code> · Provider:{' '}
            {config.provider}
          </p>
        </div>
        <div className="text-right text-sm text-ink-500">
          <p>
            <span className="font-medium text-ink-900">{muteCount}</span> mute ·{' '}
            <span className="font-medium text-ink-900">{skipCount}</span> skip
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-sm font-medium text-ink-700">
          Match patterns
        </h3>
        <ul className="flex flex-wrap gap-2">
          {config.matchPatterns.map((pattern) => (
            <li
              key={pattern}
              className="rounded-md bg-ink-100 px-2 py-1 font-mono text-xs text-ink-700"
            >
              {pattern}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-sm font-medium text-ink-700">
          Timestamp filters
        </h3>
        <FilterTable filters={config.filters} />
      </div>
    </section>
  );
}
