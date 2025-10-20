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
import { useCreateTag } from '@/hooks/use-create-tag';
import { useEditTask } from '@/hooks/use-edit-task';
import { editTaskFormSchema } from '@/lib/validation/task';
import { TaskWithInclude } from '@/types/task';

import TaskFormFields from './TaskFormFields';

type Props = {
  initialData: TaskWithInclude<'tags'>;
  onSuccess?: () => void;
};

type EditTaskInput = z.infer<typeof editTaskFormSchema>;

const EditTaskForm = ({ initialData, onSuccess }: Props) => {
  const form = useForm({
    resolver: zodResolver(editTaskFormSchema),
    defaultValues: {
      ...initialData,
      deadline: initialData.deadline
        ? new Date(initialData.deadline)
        : undefined,
      tags: initialData.tags.map((tag) => ({ value: tag.id, label: tag.name })),
    },
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending, isError, error } = useEditTask(initialData.id, {
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: [
          'tasks',
          {
            projectId: initialData.projectId,
            status: initialData.status,
            viewMode: 'kanban',
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'tasks',
          {
            projectId: initialData.projectId,
            status: data.status,
            viewMode: 'kanban',
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'tasks',
          { projectId: initialData.projectId, viewMode: 'list' },
        ],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks', initialData.id] });
      toast.success('Successfully edited tasks');
      router.refresh();
      onSuccess?.();
    },
    onError(e) {
      toast.error('Failed to edit task', { description: e.message });
    },
  });

  const { mutateAsync: addTag } = useCreateTag({
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Successfully created tag');
    },
    onError(e) {
      toast.error('Failed to create tag', { description: e.message });
    },
  });

  const onSubmit = (input: EditTaskInput) => {
    mutate(input);
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <TaskFormFields
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        form={form}
        isPending={isPending}
        onTagCreate={addTag}
        mode="edit"
      />

      {isError && <div className="text-muted-foreground">{error.message}</div>}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Loading...
          </>
        ) : (
          'Edit'
        )}
      </Button>
    </form>
  );
};

export default EditTaskForm;
