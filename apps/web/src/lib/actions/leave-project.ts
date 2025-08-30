'use server';

import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';

import { APP_BASE_URL } from '@/constants/env';
import { Project } from '@/types/project';

export async function leaveProject(id: string) {
  const res = await fetch(`${APP_BASE_URL}/api/proxy/projects/${id}/users/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: (await headers()).get('Cookie') || '',
    },
  });

  if (!res.ok) {
    const data = (await res.json()) as { message: string | string[] };

    return {
      data: null,
      error: new Error(
        Array.isArray(data.message) ? data.message.join(', ') : data.message
      ),
    };
  }

  revalidateTag('projects');

  return { data: (await res.json()) as Project, error: null };
}
