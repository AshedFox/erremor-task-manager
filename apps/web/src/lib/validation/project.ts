import z from 'zod';

import { PROJECT_SORT } from '@/constants/project';

export const projectSortSchema = z
  .enum(PROJECT_SORT)
  .catch('AZ_DESC')
  .default('AZ_DESC');
