'use server';

import { revalidateTag } from 'next/cache';

import { Project } from '@/types/project';

import { apiFetchSafe } from '../api-fetch.server';

export async function deleteProject(id: string) {
  const result = await apiFetchSafe<Project>(`/projects/${id}`, {
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
