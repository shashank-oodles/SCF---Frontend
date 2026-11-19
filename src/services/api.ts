import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CreateTitlePayload,
  HealthResponse,
  PublishTitlePayload,
  TitleFilterConfig,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:3001/api';

async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
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
    const detail =
      err?.errors && err.errors.length > 0
        ? ` (${err.errors.join('; ')})`
        : '';
    throw new Error(
      `${err?.message || `Request failed (${response.status})`}${detail}`
    );
  }

  return body as T;
}

export async function checkHealth(): Promise<HealthResponse> {
  return requestJson<HealthResponse>('/health');
}

export async function fetchAllFilters(): Promise<TitleFilterConfig[]> {
  const body = await requestJson<ApiSuccessResponse<TitleFilterConfig[]>>(
    '/filters'
  );
  return body.data;
}

export async function fetchFiltersByTitleId(
  titleId: string
): Promise<TitleFilterConfig> {
  const body = await requestJson<ApiSuccessResponse<TitleFilterConfig>>(
    `/filters/${encodeURIComponent(titleId)}`
  );
  return body.data;
}

export async function createTitle(
  payload: CreateTitlePayload
): Promise<TitleFilterConfig> {
  const body = await requestJson<ApiSuccessResponse<TitleFilterConfig>>(
    '/filters',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  return body.data;
}

export async function publishTitle(
  titleId: string,
  payload: PublishTitlePayload
): Promise<TitleFilterConfig> {
  const body = await requestJson<ApiSuccessResponse<TitleFilterConfig>>(
    `/filters/${encodeURIComponent(titleId)}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );
  return body.data;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
