'use server';

import { revalidateTag } from 'next/cache';

import { Invitation } from '@/types/invitation';

import { apiFetchSafe } from '../api-fetch.server';

export async function acceptInvitation(projectId: string) {
  const result = await apiFetchSafe<Invitation>(
    `/projects/${projectId}/invitations/me/accept`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  if (!result.error) {
    revalidateTag(`project-${projectId}-invitations`);
    revalidateTag(`projects`);
  }

  return result;
}
