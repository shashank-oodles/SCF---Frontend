import { useNavigate } from 'react-router-dom';
import { AddTitleForm } from '../components/AddTitleForm';
import { ErrorState } from '../components/ErrorState';
import { HealthCard } from '../components/HealthCard';
import { LoadingState } from '../components/LoadingState';
import { TitleCard } from '../components/TitleCard';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { useFilters } from '../hooks/useFilters';
import type { TitleFilterConfig } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const health = useBackendHealth();
  const filters = useFilters(health.reachable);

  function handleCreated(config: TitleFilterConfig) {
    void filters.refresh();
    navigate(`/titles/${encodeURIComponent(config.titleId)}`);
  }

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
          Add a Prime Video title, define mute/skip timestamps, and publish them
          to the backend. The Chrome extension loads the same configuration
          while you watch through Amazon&apos;s official player.
        </p>
      </header>

      <HealthCard
        status={health.status}
        reachable={health.reachable}
        message={health.message}
        onRefresh={health.refresh}
      />

      {health.reachable && <AddTitleForm onCreated={handleCreated} />}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Your titles
          </h2>
          {health.reachable && (
            <button
              type="button"
              onClick={filters.refresh}
              className="text-sm font-medium text-accent hover:text-accent-dark"
            >
              Refresh
            </button>
          )}
        </div>

        {!health.reachable && health.status !== 'loading' && (
          <ErrorState message="Connect the backend to load and edit titles." />
        )}

        {health.reachable && filters.status === 'loading' && (
          <LoadingState label="Loading titles…" />
        )}

        {health.reachable && filters.status === 'error' && (
          <ErrorState
            message={filters.error || 'Failed to load titles'}
            onRetry={filters.refresh}
          />
        )}

        {health.reachable && filters.status === 'empty' && (
          <p className="rounded-xl border border-dashed border-ink-200 bg-white/60 px-4 py-6 text-sm text-ink-500">
            No titles yet. Create one above to start adding timestamps.
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
          session. Published rules are stored in backend{' '}
          <code>filters.json</code> for now.
        </p>
      </footer>
    </div>
  );
}
