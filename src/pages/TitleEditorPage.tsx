import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FilterEditor } from '../components/FilterEditor';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { fetchFiltersByTitleId, publishTitle } from '../services/api';
import {
  formatTitleLabel,
  type FilterDraft,
  type FilterInterval,
  type TitleFilterConfig,
} from '../types';
import { formatTime, parseTimeInput } from '../utils/formatTime';

function toDrafts(filters: FilterInterval[]): FilterDraft[] {
  return filters.map((filter, index) => ({
    key: filter.id || `existing-${index}`,
    id: filter.id,
    // Always show readable m:ss / h:mm:ss in the editor (backend stores seconds)
    start: formatTime(filter.start),
    end: formatTime(filter.end),
    action: filter.action,
    label: filter.label || '',
  }));
}

function draftsToFilters(drafts: FilterDraft[]): {
  filters: FilterInterval[];
  errors: string[];
} {
  const errors: string[] = [];
  const filters: FilterInterval[] = [];

  drafts.forEach((draft, index) => {
    const start = parseTimeInput(draft.start);
    const end = parseTimeInput(draft.end);
    const row = index + 1;

    if (start === null) {
      errors.push(`Row ${row}: invalid start time`);
      return;
    }
    if (end === null) {
      errors.push(`Row ${row}: invalid end time`);
      return;
    }
    if (end <= start) {
      errors.push(`Row ${row}: end must be greater than start`);
      return;
    }

    const label =
      draft.label.trim() ||
      `${draft.action === 'mute' ? 'Mute' : 'Skip'} interval (${formatTime(start)} – ${formatTime(end)})`;

    filters.push({
      id: draft.id || `filter-${String(row).padStart(3, '0')}`,
      start,
      end,
      action: draft.action,
      label,
    });
  });

  return { filters, errors };
}

export function TitleEditorPage() {
  const { titleId = '' } = useParams<{ titleId: string }>();
  const navigate = useNavigate();

  const [config, setConfig] = useState<TitleFilterConfig | null>(null);
  const [drafts, setDrafts] = useState<FilterDraft[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishOk, setPublishOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!titleId) {
      setLoadError('Missing title id');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);
    setPublishOk(null);

    try {
      const data = await fetchFiltersByTitleId(titleId);
      setConfig(data);
      setDrafts(toDrafts(data.filters));
    } catch (err) {
      setConfig(null);
      setLoadError(err instanceof Error ? err.message : 'Failed to load title');
    } finally {
      setLoading(false);
    }
  }, [titleId]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = useMemo(() => {
    if (!config) return false;
    const { filters, errors } = draftsToFilters(drafts);
    if (errors.length > 0) return true;
    return JSON.stringify(filters) !== JSON.stringify(config.filters);
  }, [config, drafts]);

  async function handlePublish() {
    if (!config) return;

    setPublishError(null);
    setPublishOk(null);

    const { filters, errors } = draftsToFilters(drafts);
    if (errors.length > 0) {
      setPublishError(errors.join('. '));
      return;
    }

    setPublishing(true);
    try {
      const updated = await publishTitle(config.titleId, {
        title: config.title,
        kind: config.kind,
        episodeName: config.episodeName,
        videoUrl: config.videoUrl,
        matchPatterns: config.matchPatterns,
        filters,
      });
      setConfig(updated);
      setDrafts(toDrafts(updated.filters));
      setPublishOk(
        'Published to backend. The extension will pick up these timestamps on its next refresh.'
      );
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="text-sm font-medium text-accent hover:text-accent-dark"
        >
          ← Back to dashboard
        </Link>
        {dirty && (
          <span className="text-xs font-medium text-amber-700">
            Unpublished changes
          </span>
        )}
      </div>

      {loading && <LoadingState label="Loading title…" />}

      {!loading && loadError && (
        <ErrorState
          message={loadError}
          onRetry={() => {
            void load();
          }}
        />
      )}

      {!loading && config && (
        <>
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {config.kind === 'movie' ? 'Movie editor' : 'Show episode editor'}
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              {formatTitleLabel(config)}
            </h1>
            {config.kind === 'show' && config.episodeName && (
              <p className="text-sm text-ink-500">
                Show: {config.title} · Episode: {config.episodeName}
              </p>
            )}
            <p className="text-sm text-ink-500">
              ID: <code className="text-ink-700">{config.titleId}</code>
            </p>
            {config.videoUrl && (
              <a
                href={config.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block max-w-full truncate text-sm text-accent hover:text-accent-dark"
              >
                {config.videoUrl}
              </a>
            )}
          </header>

          <section className="space-y-4 rounded-xl border border-ink-200/80 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div>
              <h2 className="text-sm font-medium text-ink-700">Match patterns</h2>
              <p className="mt-1 text-xs text-ink-500">
                Used by the extension to recognize this title on Prime Video.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
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

            <FilterEditor drafts={drafts} onChange={setDrafts} />

            {publishError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {publishError}
              </p>
            )}
            {publishOk && (
              <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-dark">
                {publishOk}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-100 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink-500 hover:text-ink-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void handlePublish();
                }}
                disabled={publishing}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {publishing ? 'Publishing…' : 'Publish to backend'}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
