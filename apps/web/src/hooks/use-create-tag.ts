'use client';

import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { createTag } from '@/lib/actions/createTag';
import { createTagSchema } from '@/lib/validation/tag';
import { Tag } from '@/types/tag';

type Options = {
  onSuccess?: (tag: Tag) => void;
  onError?: (e: Error) => void;
};

type CreateTagInput = z.infer<typeof createTagSchema>;

export const useCreateTag = (options?: Options) =>
  useMutation({
    mutationFn: async (input: CreateTagInput) => {
      const { data, error } = await createTag(input);
      if (error) throw error;
      return data!;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
