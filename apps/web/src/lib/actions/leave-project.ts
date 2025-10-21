'use server';

import { revalidateTag } from 'next/cache';

import { apiFetchSafe } from '../api-fetch.server';

export async function leaveProject(id: string) {
  const result = await apiFetchSafe(`/projects/${id}/users/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!result.error) {
    revalidateTag('projects');
  }

  return result;
}
