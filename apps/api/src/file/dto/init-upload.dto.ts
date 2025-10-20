import { FileType } from '@prisma/client';
import {
  IsEnum,
  IsMimeType,
  IsNumber,
  Length,
  Max,
  Min,
} from 'class-validator';

export class InitUploadDto {
  @Length(1, 255)
  name!: string;

  @IsMimeType()
  mimetype!: string;

  @IsEnum(FileType)
  type!: FileType;

  @IsNumber()
  @Min(1)
  @Max(10_485_760)
  size!: number;
}
