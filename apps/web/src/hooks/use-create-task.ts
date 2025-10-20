'use client';

import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { createTask } from '@/lib/actions/create-task';
import { createTaskFormSchema } from '@/lib/validation/task';
import { Task } from '@/types/task';

type CreateTaskInput = z.infer<typeof createTaskFormSchema>;

type Options = {
  onSuccess?: (task: Task) => void;
  onError?: (e: Error) => void;
};

export const useCreateTask = (options?: Options) =>
  useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { tags, files, ...rest } = input;
      const { data, error } = await createTask({
        ...rest,
        existingTags: tags?.map((tag) => tag.value),
        filesIds: files?.map((file) => file.id),
      });

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
