'use server';

import { API_BASE_URL } from '@/constants/env';

export async function activate(input: { token: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = (await res.json()) as { message?: string | string[] };

    return {
      errors: Array.isArray(data.message)
        ? data.message
        : [data.message || 'Activation failed'],
    };
  }
}
