import z from 'zod';

import { FILE_TYPES } from '@/constants/file';

export const initFileUploadSchema = z.object({
  name: z.string(),
  type: z.enum(FILE_TYPES),
  size: z.number(),
  mimetype: z.string(),
});
