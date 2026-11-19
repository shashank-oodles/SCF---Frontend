import { useState } from 'react';
import type { FormEvent } from 'react';
import { createTitle } from '../services/api';
import type { TitleFilterConfig, TitleKind } from '../types';

interface AddTitleFormProps {
  onCreated: (config: TitleFilterConfig) => void;
}

export function AddTitleForm({ onCreated }: AddTitleFormProps) {
  const [kind, setKind] = useState<TitleKind>('movie');
  const [title, setTitle] = useState('');
  const [episodeName, setEpisodeName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const created = await createTitle({
        kind,
        title: title.trim(),
        videoUrl: videoUrl.trim(),
        ...(kind === 'show' ? { episodeName: episodeName.trim() } : {}),
      });
      setTitle('');
      setEpisodeName('');
      setVideoUrl('');
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create title');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-ink-200/80 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Add a title
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Choose movie or show, then paste a Prime Video link. For shows, the
          episode name helps the extension match the right episode.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink-700">Type</legend>
        <div className="flex gap-2">
          {(['movie', 'show'] as const).map((option) => {
            const selected = kind === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setKind(option)}
                aria-pressed={selected}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  selected
                    ? 'bg-accent text-white'
                    : 'border border-ink-200 bg-white text-ink-700 hover:border-accent/40'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink-700">
            {kind === 'movie' ? 'Movie title' : 'Show title'}
          </span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={kind === 'movie' ? 'The Tomorrow War' : 'FROM'}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-accent/30 placeholder:text-ink-200 focus:border-accent focus:ring-2"
          />
        </label>

        {kind === 'show' && (
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-ink-700">Episode name</span>
            <input
              type="text"
              required
              value={episodeName}
              onChange={(e) => setEpisodeName(e.target.value)}
              placeholder="Long Day's Journey Into Night"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-accent/30 placeholder:text-ink-200 focus:border-accent focus:ring-2"
            />
          </label>
        )}

        <label className="block space-y-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-ink-700">Video / detail URL</span>
          <input
            type="url"
            required
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.primevideo.com/detail/…"
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-accent/30 placeholder:text-ink-200 focus:border-accent focus:ring-2"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating…' : 'Create title'}
        </button>
      </div>
    </form>
  );
}
