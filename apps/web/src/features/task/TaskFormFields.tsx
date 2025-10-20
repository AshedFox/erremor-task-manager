import { DateTimePicker } from '@workspace/ui/components/datetime-picker';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import z from 'zod';

import { TAG_COLORS } from '@/constants/tag';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';
import { createTagSchema } from '@/lib/validation/tag';
import {
  createTaskFormSchema,
  editTaskFormSchema,
} from '@/lib/validation/task';
import { Tag } from '@/types/tag';

import FileUploader from '../file/FileUploader';
import TagSelector from '../tag/TagSelector';

type CreateTaskInput = z.infer<typeof createTaskFormSchema>;
type EditTaskInput = z.infer<typeof editTaskFormSchema>;

type Props = {
  mode: 'create' | 'edit';
  form: UseFormReturn<CreateTaskInput | EditTaskInput>;
  isPending: boolean;
  isUploading: boolean;
  onFileUpload: (file: File) => void;
  onTagCreate: (input: z.infer<typeof createTagSchema>) => Promise<Tag>;
};

const TaskFormFields = ({
  form,
  isPending,
  isUploading,
  mode,
  onFileUpload,
  onTagCreate,
}: Props) => {
  return (
    <>
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Name</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              required
              autoFocus
              disabled={isPending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              {...field}
              aria-invalid={fieldState.invalid}
              className="max-h-48"
              value={field.value ?? ''}
              rows={3}
              disabled={isPending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {mode === 'edit' && (
        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="task-status-select">Status</FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger
                  id="task-status-select"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select task status" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.split('_').join(' ').toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      )}

      <Controller
        control={form.control}
        name="priority"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor="task-priority-select">Priority</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
            >
              <SelectTrigger
                id="task-priority-select"
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder="Select task priority" />
              </SelectTrigger>
              <SelectContent>
                {TASK_PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="deadline"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Deadline</FieldLabel>
            <DateTimePicker
              {...field}
              aria-invalid={fieldState.invalid}
              yearRange={1}
              hourCycle={24}
              granularity="minute"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="tags"
        control={form.control}
        render={({ field, fieldState }) => (
          <TagSelector
            field={field}
            fieldState={fieldState}
            onTagCreate={(name) =>
              onTagCreate({
                name,
                color:
                  TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]!,
              })
            }
            onChange={(options) => form.setValue('tags', options)}
          />
        )}
      />

      <Controller
        control={form.control}
        name="files"
        render={({ field, fieldState }) => (
          <FileUploader
            files={field.value}
            fieldState={fieldState}
            isLoading={isUploading}
            onUpload={onFileUpload}
            onRemove={(id) =>
              form.setValue(
                'files',
                (field.value ?? []).filter((f) => f.id !== id)
              )
            }
          />
        )}
      />
    </>
  );
};

export default TaskFormFields;
