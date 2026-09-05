import { appConfig } from './config';
import { clearSession, getAccessToken } from './auth';

export interface ApiResult<T> {
  data?: T;
  error?: string;
  status?: number;
  source: 'api' | 'demo';
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const token = getAccessToken();
    const headers = new Headers(init?.headers);
    headers.set('Accept', 'application/json');
    if (init?.body) headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      ...init,
      headers,
      cache: 'no-store'
    });

    if (response.status === 401) {
      clearSession();
    }

    if (!response.ok) {
      let message = `API returned ${response.status}`;
      try {
        const body = (await response.json()) as { error?: string; message?: string | string[] };
        if (Array.isArray(body.message)) message = body.message.join(', ');
        else if (body.message) message = body.message;
        else if (body.error) message = body.error;
      } catch {
        // Keep the HTTP status message when the API does not return JSON.
      }
      return { error: message, status: response.status, source: 'demo' };
    }

    return { data: (await response.json()) as T, status: response.status, source: 'api' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown API error', source: 'demo' };
  }
}

export function getFromApi<T>(path: string): Promise<ApiResult<T>> {
  return request<T>(path);
}

export function postToApi<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
