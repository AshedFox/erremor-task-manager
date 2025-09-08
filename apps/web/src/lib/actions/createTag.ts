'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { Tag } from '@/types/tag';

import { apiFetchSafe } from '../api-fetch.server';
import { createTagSchema } from '../validation/tag';

type CreateTagInput = z.infer<typeof createTagSchema>;

export async function createTag(input: CreateTagInput) {
  const { data, error } = await apiFetchSafe<Tag>('/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!error) {
    revalidateTag('tags');
  }

  return { data, error };
}
