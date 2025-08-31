import { PartialType } from '@nestjs/mapped-types';

import { CreateProjectInvitationDto } from './create-project-invitation.dto';

export class UpdateProjectInvitationDto extends PartialType(
  CreateProjectInvitationDto
) {}
