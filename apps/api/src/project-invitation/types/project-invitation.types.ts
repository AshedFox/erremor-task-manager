import { ProjectInvitation } from '@prisma/client';

import { CreateProjectInvitationDto } from '../dto/create-project-invitation.dto';
import { UpdateProjectInvitationDto } from '../dto/update-project-invitation.dto';

export type CreateProjectInvitationParams = CreateProjectInvitationDto & {
  invitedBy: string;
};
export type UpdateProjectInvitationParams = UpdateProjectInvitationDto;
export type FindManyProjectInvitations = [ProjectInvitation[], number];
