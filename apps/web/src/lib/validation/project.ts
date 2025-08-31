import z, { literal } from 'zod';

import {
  PROJECT_COLORS,
  PROJECT_SORT,
  PROJECT_STATUSES,
} from '@/constants/project';

export const createProjectSchema = z.object({
  name: z.string().min(2).max(64),
  description: z
    .string()
    .min(3)
    .max(4000)
    .or(literal(''))
    .transform((val) => (!val ? null : val))
    .nullable(),
  color: z.enum(PROJECT_COLORS).catch('#06B6D4').optional(),
});

export const editProjectSchema = createProjectSchema.extend({
  status: z.enum(PROJECT_STATUSES),
});

export const projectSortSchema = z
  .enum(PROJECT_SORT)
  .catch('AZ_DESC')
  .default('AZ_DESC');
