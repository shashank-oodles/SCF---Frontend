import { StatusBadge } from './StatusBadge';
import { getApiBaseUrl } from '../services/api';
import type { LoadState } from '../types';

interface HealthCardProps {
  status: LoadState;
  reachable: boolean;
  message: string | null;
  onRefresh: () => void;
}

export function HealthCard({
  status,
  reachable,
  message,
  onRefresh,
}: HealthCardProps) {
  const tone = reachable ? 'ok' : status === 'loading' ? 'neutral' : 'error';
  const label = reachable
    ? 'API reachable'
    : status === 'loading'
      ? 'Checking…'
      : 'API unreachable';

  return (
    <section className="rounded-xl border border-ink-200/80 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Backend status
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Endpoint: <code className="text-ink-700">{getApiBaseUrl()}</code>
          </p>
        </div>
        <StatusBadge tone={tone} label={label} />
      </div>

      <p className="mt-4 text-sm text-ink-700">
        {status === 'loading' && 'Checking health…'}
        {status === 'success' && (message || 'Backend is running')}
        {status === 'error' && (message || 'Unable to reach the backend')}
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-4 rounded-md bg-ink-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-ink-700"
      >
        Recheck
      </button>
    </section>
  );
}
