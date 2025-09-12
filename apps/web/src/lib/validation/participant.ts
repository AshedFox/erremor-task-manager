import { format } from 'date-fns';
import z from 'zod';

import { PARTICIPANT_ROLES } from '@/constants/participant';

export const inviteParticipantSchema = z.object({
  userId: z.uuid(),
  role: z.enum(PARTICIPANT_ROLES),
  expiresAt: z
    .date()
    .min(new Date(), {
      error: (val) =>
        `Your date must be after ${format(Number(val.minimum), 'PPP')}`,
    })
    .max(new Date(new Date().setMonth(new Date().getMonth() + 1)), {
      error: (val) =>
        `Your date must be before ${format(Number(val.maximum), 'PPP')}`,
    }),
});
