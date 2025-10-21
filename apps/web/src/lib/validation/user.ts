import { format } from 'date-fns';
import z from 'zod';

export const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[A-Za-z0-9 -]+$/, {
      error: 'Display name must contain only numbers and latin letters',
    })
    .optional(),
  birthDate: z
    .date()
    .min(new Date('1990-01-01'), {
      error: (val) =>
        `Your date must be after ${format(Number(val.minimum), 'PPP')}`,
    })
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 12)), {
      error: (val) =>
        `Your date must be before ${format(Number(val.maximum), 'PPP')}`,
    })
    .nullish(),
  avatarId: z.uuid().optional(),
});
