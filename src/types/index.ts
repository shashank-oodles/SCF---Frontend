export type FilterAction = 'mute' | 'skip';
export type TitleKind = 'movie' | 'show';

export interface FilterInterval {
  id: string;
  start: number;
  end: number;
  action: FilterAction;
  label?: string;
}

export interface TitleFilterConfig {
  titleId: string;
  title: string;
  kind: TitleKind;
  episodeName?: string;
  provider: 'prime-video';
  /** Source video / detail URL from authoring */
  videoUrl?: string;
  matchPatterns: string[];
  filters: FilterInterval[];
}

export interface CreateTitlePayload {
  title: string;
  kind: TitleKind;
  episodeName?: string;
  videoUrl: string;
}

export interface PublishTitlePayload {
  title?: string;
  kind?: TitleKind;
  episodeName?: string;
  videoUrl?: string;
  matchPatterns?: string[];
  filters: FilterInterval[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface HealthResponse {
  success: true;
  message: string;
}

export type LoadState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

/** Draft row used in the editor before publish (id may be temporary). */
export interface FilterDraft {
  key: string;
  id: string;
  start: string;
  end: string;
  action: FilterAction;
  label: string;
}

export function formatTitleLabel(config: Pick<TitleFilterConfig, 'title' | 'kind' | 'episodeName'>): string {
  if (config.kind === 'show' && config.episodeName?.trim()) {
    return `${config.title} — ${config.episodeName.trim()}`;
  }
  return config.title;
}
