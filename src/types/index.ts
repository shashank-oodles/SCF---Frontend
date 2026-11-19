export type FilterAction = 'mute' | 'skip';

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
  provider: 'prime-video';
  matchPatterns: string[];
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
