import z from 'zod';

import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';

import { optionSchema } from './common';
import { createTagSchema } from './tag';

export const createTaskSchema = z.object({
  projectId: z.uuid(),
  title: z.string().min(2).max(100),
  description: z.string().min(3).max(4000).optional(),
  deadline: z.date().optional(),
  priority: z.enum(TASK_PRIORITIES),
  existingTags: z.array(z.uuid()).min(1).optional(),
  newTags: z.array(createTagSchema).min(1).optional(),
});

export const createTaskFormSchema = createTaskSchema
  .omit({ existingTags: true, newTags: true })
  .extend({
    tags: z.array(optionSchema).optional(),
  });

export const editTaskSchema = createTaskSchema.extend({
  status: z.enum(TASK_STATUSES),
});

export const editTaskFormSchema = createTaskFormSchema.extend({
  status: z.enum(TASK_STATUSES),
});
