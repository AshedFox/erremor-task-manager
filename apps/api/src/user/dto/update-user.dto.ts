import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 64)
  displayName?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;
}
