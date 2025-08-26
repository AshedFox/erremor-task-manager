import { IsOptional, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(2, 64)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(3, 4000)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(3, 32)
  color?: string;
}
