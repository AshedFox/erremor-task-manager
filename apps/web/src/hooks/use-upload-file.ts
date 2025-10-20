'use client';

import { useMutation } from '@tanstack/react-query';

import { completeFileUpload } from '@/lib/actions/complete-file-upload';
import { initFileUpload } from '@/lib/actions/init-file-upload';
import { File as ApiFile, FileType } from '@/types/file';

type Options = {
  onSuccess?: (file: ApiFile) => void;
  onError?: (e: Error) => void;
};

export const useUploadFile = (options?: Options) =>
  useMutation({
    mutationFn: async (file: File) => {
      const fileType: FileType = file.type.startsWith('image/')
        ? 'IMAGE'
        : file.type.startsWith('audio/')
          ? 'AUDIO'
          : file.type.startsWith('video/')
            ? 'VIDEO'
            : 'FILE';

      const initResult = await initFileUpload({
        name: file.name,
        type: fileType,
        size: file.size,
        mimetype: file.type,
      });

      if (initResult.error) {
        throw new Error(initResult.error.message);
      }

      const uploadRes = await fetch(initResult.data.uploadUrl, {
        method: 'PUT',
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file');
      }

      const completeResult = await completeFileUpload(initResult.data.fileId);

      if (completeResult.error) {
        throw new Error(completeResult.error.message);
      }

      return completeResult.data;
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });
