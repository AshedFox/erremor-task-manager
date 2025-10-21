'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { createProjectSchema } from '@/lib/validation/project';
import { Project } from '@/types/project';

import { apiFetchSafe } from '../api-fetch.server';

type CreateProjectInput = z.infer<typeof createProjectSchema>;

export async function createProject(input: CreateProjectInput) {
  const result = await apiFetchSafe<Project>(`/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!result.error) {
    revalidateTag('projects');
  }

  return result;
}
