import 'server-only';

import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE_KEY, API_BASE_URL } from '@/constants/env';
import { ApiFetchError, FetchResult } from '@/types/common';

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
      const { message, data } = (await res.json()) as {
        message: string | string[];
        data?: unknown;
      };

      return {
        error: {
          message: message instanceof Array ? message.join(', ') : message,
          status: res.status,
          data,
          name: ApiFetchError.name,
        },
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
      error: {
        message: 'Failed to fetch',
        status: 500,
        name: ApiFetchError.name,
        data: undefined,
      },
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
