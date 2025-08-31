import { ParticipantRole } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class SearchProjectInvitationsFilterDto {
  @IsOptional()
  @IsEnum(ParticipantRole)
  role?: ParticipantRole;

  @IsOptional()
  @IsUUID()
  invitedBy?: string;
}
