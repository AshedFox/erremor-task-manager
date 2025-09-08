'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { TAG_COLORS } from '@/constants/tag';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';
import { createTask } from '@/lib/actions/create-task';
import { createTag } from '@/lib/actions/createTag';
import { apiFetch } from '@/lib/api-fetch.client';
import { createTagSchema } from '@/lib/validation/tag';
import { createTaskFormSchema } from '@/lib/validation/task';
import { SearchResult } from '@/types/common';
import { Tag } from '@/types/tag';

type CreateTaskInput = z.infer<typeof createTaskFormSchema>;
type CreateTagInput = z.infer<typeof createTagSchema>;

type Props = {
  projectId: string;
  onSuccess?: () => void;
};

const CreateTaskForm = ({ onSuccess, projectId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { tags, ...rest } = input;
      const { data, error } = await createTask({
        ...rest,
        existingTags: tags?.map((tag) => tag.value),
      });

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess(_data, { projectId }) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
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
              <FormLabel>Description (optional)</FormLabel>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    size="sm"
                    mode="single"
                    selected={field.value}
                    onSelect={(e) => field.onChange(e)}
                    captionLayout="dropdown"
                    disabled={(date) => date <= new Date()}
                  />
                </PopoverContent>
              </Popover>
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
              Creating...
            </>
          ) : (
            'Create'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateTaskForm;
