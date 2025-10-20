'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { TASK_STATUSES } from '@/constants/task';
import { useCreateTag } from '@/hooks/use-create-tag';
import { useCreateTask } from '@/hooks/use-create-task';
import { createTaskFormSchema } from '@/lib/validation/task';

import TaskFormFields from './TaskFormFields';

type CreateTaskInput = z.infer<typeof createTaskFormSchema>;

type Props = {
  projectId: string;
  onSuccess?: () => void;
};

const CreateTaskForm = ({ onSuccess, projectId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useCreateTask({
    onSuccess({ projectId }) {
      queryClient.invalidateQueries({
        queryKey: [
          'tasks',
          { projectId, status: TASK_STATUSES[0], viewMode: 'kanban' },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', { projectId, viewMode: 'list' }],
      });
      toast.success('Successfully created task');
      router.refresh();
      onSuccess?.();
    },
    onError(e) {
      toast.error('Failed to create task', { description: e.message });
    },
  });

  const { mutateAsync: addTag } = useCreateTag({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Successfully created tag');
    },
    onError: (e) =>
      toast.error('Failed to create tag', { description: e.message }),
  });

  const form = useForm({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: '',
      projectId,
      description: undefined,
      deadline: undefined,
      priority: 'MEDIUM',
    },
  });
  function onSubmit(values: CreateTaskInput) {
    mutate(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
      <TaskFormFields
        form={form}
        isPending={isPending}
        onTagCreate={addTag}
        mode="create"
      />

      {isError && <div className="text-muted-foreground">{error.message}</div>}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Creating...
          </>
        ) : (
          'Create'
        )}
      </Button>
    </form>
  );
};

export default CreateTaskForm;
