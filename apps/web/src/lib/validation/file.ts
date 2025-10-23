import z from 'zod';

import { FILE_TYPES } from '@/constants/file';

export const initFileUploadSchema = z.object({
  name: z.string(),
  type: z.enum(FILE_TYPES),
  size: z.number(),
  mimetype: z.string(),
});

export const fileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(FILE_TYPES),
  url: z.string(),
  size: z.number(),
  mimetype: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
