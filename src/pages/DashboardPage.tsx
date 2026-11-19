import { ErrorState } from '../components/ErrorState';
import { HealthCard } from '../components/HealthCard';
import { LoadingState } from '../components/LoadingState';
import { TitleCard } from '../components/TitleCard';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { useFilters } from '../hooks/useFilters';

export function DashboardPage() {
  const health = useBackendHealth();
  const filters = useFilters(health.reachable);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Streaming Content Filtering
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          SCF Proof of Concept
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
          Inspect the agreed Prime Video title and its mute/skip timestamp
          rules. The Chrome extension loads this same configuration from the
          backend while you watch through Amazon&apos;s official player.
        </p>
      </header>

      <HealthCard
        status={health.status}
        reachable={health.reachable}
        message={health.message}
        onRefresh={health.refresh}
      />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Filter configuration
          </h2>
          {health.reachable && (
            <button
              type="button"
              onClick={filters.refresh}
              className="text-sm font-medium text-accent hover:text-accent-dark"
            >
              Refresh filters
            </button>
          )}
        </div>

        {!health.reachable && health.status !== 'loading' && (
          <ErrorState message="Connect the backend to load filter configuration." />
        )}

        {health.reachable && filters.status === 'loading' && (
          <LoadingState label="Loading filter configuration…" />
        )}

        {health.reachable && filters.status === 'error' && (
          <ErrorState
            message={filters.error || 'Failed to load filters'}
            onRetry={filters.refresh}
          />
        )}

        {health.reachable && filters.status === 'empty' && (
          <p className="rounded-xl border border-dashed border-ink-200 bg-white/60 px-4 py-6 text-sm text-ink-500">
            No titles are configured yet.
          </p>
        )}

        {health.reachable &&
          filters.status === 'success' &&
          filters.titles.map((title) => (
            <TitleCard key={title.titleId} config={title} />
          ))}
      </section>

      <footer className="mt-auto border-t border-ink-200/70 pt-6 text-xs text-ink-500">
        <p>
          POC only — does not download, decrypt, or re-stream Prime Video
          content. Filtering acts on the HTML video element in your browser
          session.
        </p>
      </footer>
    </div>
  );
}
