'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { editProjectSchema } from '@/lib/validation/project';
import { Project } from '@/types/project';

import { apiFetchSafe } from '../api-fetch.server';

type EditProjectInput = z.infer<typeof editProjectSchema>;

export async function editProject(id: string, input: EditProjectInput) {
  const result = await apiFetchSafe<Project>(`/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!result.error) {
    revalidateTag('projects');
    revalidateTag(`project-${id}`);
  }

  return result;
}
