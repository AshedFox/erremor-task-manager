'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { DateTimePicker } from '@workspace/ui/components/datetime-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import MultipleSelector from '@workspace/ui/components/multiple-selector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { TAG_COLORS } from '@/constants/tag';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';
import { createTag } from '@/lib/actions/createTag';
import { editTask } from '@/lib/actions/editTask';
import { apiFetch } from '@/lib/api-fetch.client';
import { createTagSchema } from '@/lib/validation/tag';
import { editTaskFormSchema } from '@/lib/validation/task';
import { SearchResult } from '@/types/common';
import { Tag } from '@/types/tag';
import { TaskWithInclude } from '@/types/task';

type Props = {
  initialData: TaskWithInclude<'tags'>;
  onSuccess?: () => void;
};

type EditTaskInput = z.infer<typeof editTaskFormSchema>;
type CreateTagInput = z.infer<typeof createTagSchema>;

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
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (input: EditTaskInput) => {
      const { tags, ...rest } = input;
      const { data, error } = await editTask(initialData.id, {
        ...rest,
        existingTags: tags?.map((tag) => tag.value),
      });

      if (error) {
        throw error;
      }

      return data;
    },
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
  const { mutateAsync: addTag } = useMutation({
    mutationFn: async (input: CreateTagInput) => {
      const { data, error } = await createTag(input);

      if (error) {
        throw error;
      }

      return data!;
    },
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
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} required autoFocus disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="max-h-48"
                  {...field}
                  value={field.value ?? ''}
                  rows={3}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select task status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.split('_').join(' ').toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select task priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <DateTimePicker
                  {...field}
                  yearRange={1}
                  hourCycle={24}
                  granularity="minute"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  minLength={2}
                  maxLength={48}
                  placeholder="Select tags for task"
                  delay={300}
                  onSearch={async (query) => {
                    const { nodes } = await apiFetch<SearchResult<Tag>>(
                      `/tags?name=${query}`
                    );

                    return nodes.map((tag) => ({
                      value: tag.id,
                      label: tag.name,
                    }));
                  }}
                  creatable
                  createOption={async (value) => {
                    const tag = await addTag({
                      name: value,
                      color:
                        TAG_COLORS[
                          Math.floor(Math.random() * TAG_COLORS.length)
                        ]!,
                    });

                    return { value: tag.id, label: tag.name };
                  }}
                  onChange={(options) => {
                    form.setValue('tags', options);
                  }}
                  loadingIndicator={
                    <div className="flex items-center justify-center p-4">
                      <Spinner className="size-6" /> Loading...
                    </div>
                  }
                  creatingIndicator={
                    <div className="flex items-center justify-center p-4">
                      <Spinner className="size-6" /> Creating...
                    </div>
                  }
                  emptyIndicator={
                    <div className="flex items-center justify-center p-4 text-sm font-normal text-muted-foreground">
                      Nothing found...
                    </div>
                  }
                  maxSelected={8}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isError && (
          <div className="text-muted-foreground">{error.message}</div>
        )}

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
    </Form>
  );
};

export default EditTaskForm;
