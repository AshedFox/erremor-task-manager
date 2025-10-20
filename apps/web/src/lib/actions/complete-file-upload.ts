'use server';

import { apiFetchSafe } from '@/lib/api-fetch.server';
import { File } from '@/types/file';

export async function completeFileUpload(id: string) {
  const result = await apiFetchSafe<File>(`/files/${id}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return result;
}
