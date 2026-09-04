import { appConfig } from './config';

export interface ApiResult<T> {
  data?: T;
  error?: string;
  source: 'api' | 'demo';
}

export async function getFromApi<T>(path: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) {
      return { error: `API returned ${response.status}`, source: 'demo' };
    }
    return { data: (await response.json()) as T, source: 'api' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown API error', source: 'demo' };
  }
}
