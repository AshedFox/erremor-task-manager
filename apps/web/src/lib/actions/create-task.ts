'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { Task } from '@/types/task';

import { apiFetchSafe } from '../api-fetch.server';
import { createTaskSchema } from '../validation/task';

type CreateTaskInput = z.infer<typeof createTaskSchema>;

export async function createTask(input: CreateTaskInput) {
  const result = await apiFetchSafe<Task>(`/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!result.error) {
    revalidateTag(`projects-${input.projectId}-tasks`);
  }

  return result;
}
