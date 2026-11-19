import { useCallback, useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import type { LoadState } from '../types';

interface HealthState {
  status: LoadState;
  message: string | null;
  reachable: boolean;
  refresh: () => void;
}

export function useBackendHealth(pollMs = 15000): HealthState {
  const [status, setStatus] = useState<LoadState>('loading');
  const [message, setMessage] = useState<string | null>(null);
  const [reachable, setReachable] = useState(false);

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await checkHealth();
      setReachable(true);
      setMessage(result.message);
      setStatus('success');
    } catch (err) {
      setReachable(false);
      setMessage(err instanceof Error ? err.message : 'Health check failed');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), pollMs);
    return () => window.clearInterval(id);
  }, [refresh, pollMs]);

  return { status, message, reachable, refresh };
}
