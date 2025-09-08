import { IsHexColor, IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsHexColor()
  color!: string;

  @IsString()
  @Length(2, 64)
  name!: string;
}
