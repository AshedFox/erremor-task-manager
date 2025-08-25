'use server';

import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { APP_BASE_URL } from '@/constants/env';
import { User } from '@/types/user';

import { editProfileSchema } from '../validation/user';

type EditProfileInput = z.infer<typeof editProfileSchema>;

export async function editProfile(input: EditProfileInput) {
  const res = await fetch(`${APP_BASE_URL}/api/proxy/users/me`, {
    method: 'PATCH',
    body: JSON.stringify(input),
    headers: {
      Cookie: (await headers()).get('Cookie') ?? '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const { message } = (await res.json()) as { message: string[] | string };
    return {
      error: new Error(message instanceof Array ? message.join(', ') : message),
      data: null,
    };
  }

  revalidateTag('current-user');

  return {
    error: null,
    data: (await res.json()) as User,
  };
}
