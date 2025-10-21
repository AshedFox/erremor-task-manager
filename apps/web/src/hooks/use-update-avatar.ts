import { useMutation } from '@tanstack/react-query';

import { editProfile } from '@/lib/actions/edit-profile';
import { UserWithInclude } from '@/types/user';

import { useUploadFile } from './use-upload-file';

type Options = {
  onSuccess?: (user: UserWithInclude<'avatar'>) => void;
  onError?: (e: Error) => void;
};

export const useUpdateAvatar = (options?: Options) => {
  const { mutateAsync: upload } = useUploadFile();

  return useMutation({
    mutationFn: async (file: File) => {
      const { id } = await upload(file);

      const { data, error } = await editProfile({
        avatarId: id,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
