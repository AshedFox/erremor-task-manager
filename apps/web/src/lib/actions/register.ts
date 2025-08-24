'use server';

import z from 'zod';

import { API_BASE_URL } from '@/constants/env';

import { registerSchema } from '../validation/auth';

type RegisterInput = z.infer<typeof registerSchema>;

export async function register(input: RegisterInput) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
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
        : [data.message || 'Registration failed'],
    };
  }
}
