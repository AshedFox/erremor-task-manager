import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 64)
  displayName?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsUUID()
  avatarId?: string;
}
