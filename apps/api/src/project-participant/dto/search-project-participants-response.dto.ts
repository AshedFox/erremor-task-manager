import { ProjectParticipant } from '@prisma/client';

export class SearchProjectParticipantsResponseDto {
  nodes!: ProjectParticipant[];
  totalCount!: number;
}
