import z from 'zod';

import { TASK_PRIORITIES } from '@/constants/task';

export const createTaskSchema = z.object({
  projectId: z.uuid(),
  title: z.string().min(2).max(100),
  description: z.string().min(3).max(4000).optional(),
  deadline: z.date().optional(),
  priority: z.enum(TASK_PRIORITIES),
});
