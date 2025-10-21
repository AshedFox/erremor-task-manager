'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { UserWithInclude } from '@/types/user';

import { apiFetchSafe } from '../api-fetch.server';
import { editProfileSchema } from '../validation/user';

type EditProfileInput = z.infer<typeof editProfileSchema>;

export async function editProfile(input: EditProfileInput) {
  const result = await apiFetchSafe<UserWithInclude<'avatar'>>(
    `/users/me?include=avatar`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  if (!result.error) {
    revalidateTag('current-user');
  }

  return result;
}
