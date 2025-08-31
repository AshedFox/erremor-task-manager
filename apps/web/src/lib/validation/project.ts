import z, { literal } from 'zod';

import { PROJECT_COLORS, PROJECT_SORT } from '@/constants/project';

export const createProjectSchema = z.object({
  name: z.string().min(2).max(64),
  description: z
    .string()
    .min(3)
    .max(4000)
    .or(literal(''))
    .transform((val) => (!val ? null : val))
    .nullable(),
  color: z.enum(PROJECT_COLORS).optional(),
});

export const projectSortSchema = z
  .enum(PROJECT_SORT)
  .catch('AZ_DESC')
  .default('AZ_DESC');
