'use server';

import z from 'zod';

import { apiFetchSafe } from '@/lib/api-fetch.server';

import { initFileUploadSchema } from '../validation/file';

type InitFileUploadInput = z.infer<typeof initFileUploadSchema>;

export async function initFileUpload(input: InitFileUploadInput) {
  const result = await apiFetchSafe<{ fileId: string; uploadUrl: string }>(
    `/files/init`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    }
  );

  return result;
}
