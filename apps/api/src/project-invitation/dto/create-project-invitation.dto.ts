import { ParticipantRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum } from 'class-validator';

export class CreateProjectInvitationDto {
  @IsEnum(ParticipantRole)
  role!: ParticipantRole;

  @IsDate()
  @Type(() => Date)
  expiresAt!: Date;
}
