'use client';

import { ApiFetchError, FetchResult } from '@/types/common';

export async function apiFetchSafe<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<FetchResult<T>> {
  try {
    const res = await fetch(`/api/proxy${path}`, {
      ...init,
      credentials: 'include',
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
