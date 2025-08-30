'use client';

import { FetchResult } from '@/types/common';

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
