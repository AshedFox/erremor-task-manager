'use server';

import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { APP_BASE_URL } from '@/constants/env';
import { Task } from '@/types/task';

import { createTaskSchema } from '../validation/task';

type CreateTaskInput = z.infer<typeof createTaskSchema>;

export async function createTask(input: CreateTaskInput) {
  const res = await fetch(`${APP_BASE_URL}/api/proxy/tasks`, {
    method: 'POST',
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

  revalidateTag(`projects-${input.projectId}-tasks`);

  return { data: (await res.json()) as Task, error: null };
}
