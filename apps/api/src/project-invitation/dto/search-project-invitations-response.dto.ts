import { ProjectInvitation } from '@prisma/client';

export class SearchProjectInvitationsResponseDto {
  nodes!: ProjectInvitation[];
  totalCount!: number;
}
