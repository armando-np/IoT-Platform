import { appConfig } from './config';
import { clearSession, getAccessToken } from './auth';

export type ApiResult<T> = {
  data?: T;
  error?: string;
  status?: number;
  source: 'api' | 'demo';
};

function stringifyApiError(value: unknown): string {
  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    return value.map(stringifyApiError).join(', ');
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if (typeof obj.message === 'string') return obj.message;

    if (Array.isArray(obj.message)) {
      return obj.message.map(stringifyApiError).join(', ');
    }

    if (obj.message && typeof obj.message === 'object') {
      return stringifyApiError(obj.message);
    }

    if (typeof obj.error === 'string') return obj.error;

    try {
      return JSON.stringify(obj);
    } catch {
      return 'Error desconocido de la API.';
    }
  }

  if (value === null || value === undefined) {
    return 'Error desconocido de la API.';
  }

  return String(value);
}

async function requestFromApi<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const token = getAccessToken();

    const headers = new Headers(init?.headers);
    headers.set('Accept', 'application/json');

    if (init?.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      ...init,
      headers,
      cache: 'no-store'
    });

    const rawBody = await response.text();

    let body: unknown = null;
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = rawBody;
      }
    }

    if (response.status === 401) {
      clearSession();
    }

    if (!response.ok) {
      const obj = body && typeof body === 'object'
        ? (body as Record<string, unknown>)
        : null;

      const error = obj
        ? stringifyApiError(obj.message ?? obj.error ?? obj)
        : stringifyApiError(body ?? `API returned ${response.status}`);

      return {
        error,
        status: response.status,
        source: 'demo'
      };
    }

    return {
      data: body as T,
      status: response.status,
      source: 'api'
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : stringifyApiError(error),
      source: 'demo'
    };
  }
}

export function getFromApi<T>(path: string): Promise<ApiResult<T>> {
  return requestFromApi<T>(path);
}

export function postToApi<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  return requestFromApi<T>(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
