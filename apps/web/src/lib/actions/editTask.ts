'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { apiFetchSafe } from '@/lib/api-fetch.server';
import { editTaskSchema } from '@/lib/validation/task';
import { Task } from '@/types/task';

type EditTaskInput = z.infer<typeof editTaskSchema>;

export async function editTask(id: string, input: EditTaskInput) {
  const result = await apiFetchSafe<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!result.error) {
    revalidateTag('tasks');
    revalidateTag(`task-${id}`);
  }

  return result;
}
