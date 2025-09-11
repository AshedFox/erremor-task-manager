'use server';

import { revalidateTag } from 'next/cache';

import { apiFetchSafe } from '../api-fetch.server';

export async function kickParticipant(projectId: string, userId: string) {
  const result = await apiFetchSafe(`/projects/${projectId}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!result.error) {
    revalidateTag(`project-${projectId}-participants`);
  }

  return result;
}
