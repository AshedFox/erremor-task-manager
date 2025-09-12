'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { apiFetchSafe } from '../api-fetch.server';
import { inviteParticipantSchema } from '../validation/participant';

type InviteInput = z.infer<typeof inviteParticipantSchema>;

export async function inviteParticipant(projectId: string, input: InviteInput) {
  const { userId, ...restInput } = input;
  const result = await apiFetchSafe(
    `/projects/${projectId}/invitations/${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(restInput),
    }
  );

  if (!result.error) {
    revalidateTag(`project-${projectId}-invitations`);
  }

  return result;
}
