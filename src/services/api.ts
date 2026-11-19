import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  HealthResponse,
  TitleFilterConfig,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:3001/api';

async function getJson<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new Error(
      `Unable to reach the backend at ${API_BASE_URL}. Is it running?`
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Invalid JSON response from ${path}`);
  }

  if (!response.ok) {
    const err = body as ApiErrorResponse;
    throw new Error(err?.message || `Request failed (${response.status})`);
  }

  return body as T;
}

export async function checkHealth(): Promise<HealthResponse> {
  return getJson<HealthResponse>('/health');
}

export async function fetchAllFilters(): Promise<TitleFilterConfig[]> {
  const body = await getJson<ApiSuccessResponse<TitleFilterConfig[]>>('/filters');
  return body.data;
}

export async function fetchFiltersByTitleId(
  titleId: string
): Promise<TitleFilterConfig> {
  const body = await getJson<ApiSuccessResponse<TitleFilterConfig>>(
    `/filters/${encodeURIComponent(titleId)}`
  );
  return body.data;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
