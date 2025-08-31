'use server';

import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { APP_BASE_URL } from '@/constants/env';
import { editProjectSchema } from '@/lib/validation/project';
import { Project } from '@/types/project';

type EditProjectInput = z.infer<typeof editProjectSchema>;

export async function editProject(id: string, input: EditProjectInput) {
  const res = await fetch(`${APP_BASE_URL}/api/proxy/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: (await headers()).get('Cookie') || '',
    },
    body: JSON.stringify(input),
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
  revalidateTag(`project-${id}`);

  return { data: (await res.json()) as Project, error: null };
}
