import 'server-only';

import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE_KEY, API_BASE_URL } from '@/constants/env';

type FetchResult<T> =
  | {
      data: T;
      error: null;
    }
  | { data: null; error: Error };

export async function apiFetchSafe<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<FetchResult<T>> {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const { message } = (await res.json()) as { message: string | string[] };

      return {
        error: new Error(
          message instanceof Array ? message.join(', ') : message
        ),
        data: null,
      };
    }

    return {
      data: (await res.json()) as T,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: new Error('Failed to fetch'),
    };
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const { data, error } = await apiFetchSafe<T>(path, init);

  if (error) {
    throw error;
  }

  return data;
}
