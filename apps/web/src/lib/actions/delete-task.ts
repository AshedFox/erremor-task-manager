'use server';

import { revalidateTag } from 'next/cache';

import { Task } from '@/types/task';

import { apiFetchSafe } from '../api-fetch.server';

export async function deleteTask(id: string) {
  console.log('start action', id);
  const { data, error } = await apiFetchSafe<Task>(`/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  console.log('Delete completed', data, error);

  if (!error) {
    revalidateTag('tasks');
    revalidateTag(`tasks-${id}`);
  }

  return { data, error };
}
