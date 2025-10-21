'use server';

import { revalidateTag } from 'next/cache';

import { Invitation } from '@/types/invitation';

import { apiFetchSafe } from '../api-fetch.server';

export async function cancelInvitation(projectId: string, userId: string) {
  const result = await apiFetchSafe<Invitation>(
    `/projects/${projectId}/invitations/${userId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  if (!result.error) {
    revalidateTag(`project-${projectId}-invitations`);
  }

  return result;
}
