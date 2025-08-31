import { ParticipantRole, ParticipantStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class SearchProjectParticipantsFilterDto {
  @IsOptional()
  @IsEnum(ParticipantRole)
  role?: ParticipantRole;

  @IsOptional()
  @IsEnum(ParticipantStatus)
  status?: ParticipantStatus;
}
