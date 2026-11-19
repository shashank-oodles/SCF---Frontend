import { Link } from 'react-router-dom';
import { formatTitleLabel, type TitleFilterConfig } from '../types';

interface TitleCardProps {
  config: TitleFilterConfig;
}

export function TitleCard({ config }: TitleCardProps) {
  const muteCount = config.filters.filter((f) => f.action === 'mute').length;
  const skipCount = config.filters.filter((f) => f.action === 'skip').length;

  return (
    <Link
      to={`/titles/${encodeURIComponent(config.titleId)}`}
      className="block rounded-xl border border-ink-200/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:border-accent/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {config.kind === 'movie' ? 'Movie' : 'Show episode'}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink-900">
            {formatTitleLabel(config)}
          </h2>
          {config.kind === 'show' && config.episodeName && (
            <p className="mt-1 text-sm text-ink-500">
              Show: {config.title}
            </p>
          )}
          <p className="mt-1 text-sm text-ink-500">
            ID: <code className="text-ink-700">{config.titleId}</code> · Provider:{' '}
            {config.provider}
          </p>
          {config.videoUrl && (
            <p className="mt-2 max-w-xl truncate text-xs text-ink-500">
              {config.videoUrl}
            </p>
          )}
        </div>
        <div className="text-right text-sm text-ink-500">
          <p>
            <span className="font-medium text-ink-900">{muteCount}</span> mute ·{' '}
            <span className="font-medium text-ink-900">{skipCount}</span> skip
          </p>
          <p className="mt-2 text-xs font-medium text-accent">
            Edit timestamps →
          </p>
        </div>
      </div>
    </Link>
  );
}
