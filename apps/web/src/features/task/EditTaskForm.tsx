'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { useCreateTag } from '@/hooks/use-create-tag';
import { useEditTask } from '@/hooks/use-edit-task';
import { useUploadFile } from '@/hooks/use-upload-file';
import { editTaskFormSchema } from '@/lib/validation/task';
import { TaskWithInclude } from '@/types/task';

import TaskEditConflictAlert from './TaskEditConflictAlert';
import TaskFormFields from './TaskFormFields';

type Props = {
  initialData: TaskWithInclude<'tags' | 'files'>;
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

  const [currentVersion, setCurrentVersion] = useState(initialData.version);
  const [showChoiceDialog, setShowChoiceDialog] = useState(false);
  const [newData, setNewData] = useState<TaskWithInclude<'tags' | 'files'>>();

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
      setCurrentVersion(data.version);
      toast.success('Successfully edited tasks');
      router.refresh();
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 409) {
        setShowChoiceDialog(true);
        setNewData(e.data as TaskWithInclude<'tags' | 'files'>);
      } else {
        toast.error('Failed to edit task', { description: e.message });
      }
    },
  });

  const handleOverwrite = useCallback(() => {
    if (!newData) {
      return;
    }

    const formData = form.getValues();

    mutate({ ...formData, version: newData.version });
    setShowChoiceDialog(false);
    setNewData(undefined);
  }, [form, mutate, newData]);

  const handleAbort = useCallback(() => {
    if (!newData) {
      return;
    }

    form.reset({
      ...newData,
      deadline: newData.deadline ? new Date(newData.deadline) : undefined,
      tags: newData.tags.map((tag) => ({ value: tag.id, label: tag.name })),
    });

    setCurrentVersion(newData.version);
    setShowChoiceDialog(false);
    setNewData(undefined);

    toast.info('Data refreshed from server');
  }, [form, newData]);

  const { mutateAsync: addTag } = useCreateTag({
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Successfully created tag');
    },
    onError(e) {
      toast.error('Failed to create tag', { description: e.message });
    },
  });

  const { mutate: upload, isPending: isUploading } = useUploadFile({
    onSuccess: async (file) => {
      form.setValue('files', [...(form.getValues().files ?? []), file]);
    },
    onError: (e) => {
      toast.error('Failed to upload file', { description: e.message });
    },
  });

  const handleFileChange = useCallback(
    (file: File) => {
      if ((form.getValues().files ?? []).length >= 5) {
        toast.error('You can only upload up to 5 files at once.');
        return;
      }

      upload(file);
    },
    [form, upload]
  );

  const onSubmit = (input: EditTaskInput) => {
    mutate({ ...input, version: currentVersion });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <TaskFormFields
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        form={form}
        isPending={isPending}
        isUploading={isUploading}
        onFileUpload={handleFileChange}
        onTagCreate={addTag}
        mode="edit"
      />

      {showChoiceDialog && (
        <TaskEditConflictAlert
          onAbort={handleAbort}
          onOverwrite={handleOverwrite}
        />
      )}

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
