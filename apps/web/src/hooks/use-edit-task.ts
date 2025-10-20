'use client';

import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { editTask } from '@/lib/actions/editTask';
import { editTaskFormSchema } from '@/lib/validation/task';
import { Task } from '@/types/task';

type Options = {
  onSuccess?: (task: Task) => void;
  onError?: (e: Error) => void;
};

type EditTaskInput = z.infer<typeof editTaskFormSchema>;

export const useEditTask = (id: string, { onSuccess, onError }: Options) =>
  useMutation({
    mutationFn: async (input: EditTaskInput) => {
      const { tags, files, ...rest } = input;
      const { data, error } = await editTask(id, {
        ...rest,
        existingTags: tags?.map((tag) => tag.value),
        filesIds: files?.map((file) => file.id),
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess,
    onError,
  });
