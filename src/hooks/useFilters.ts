import { useCallback, useEffect, useState } from 'react';
import { fetchAllFilters } from '../services/api';
import type { LoadState, TitleFilterConfig } from '../types';

interface FiltersState {
  status: LoadState;
  titles: TitleFilterConfig[];
  error: string | null;
  refresh: () => void;
}

export function useFilters(enabled: boolean): FiltersState {
  const [status, setStatus] = useState<LoadState>('idle');
  const [titles, setTitles] = useState<TitleFilterConfig[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setStatus('idle');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const data = await fetchAllFilters();
      setTitles(data);
      setStatus(data.length === 0 ? 'empty' : 'success');
    } catch (err) {
      setTitles([]);
      setError(err instanceof Error ? err.message : 'Failed to load filters');
      setStatus('error');
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, titles, error, refresh };
}
