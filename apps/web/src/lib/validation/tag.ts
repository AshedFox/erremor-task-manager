import z from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(2).max(64),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color'),
});
