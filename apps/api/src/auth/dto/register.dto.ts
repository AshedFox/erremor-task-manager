import { IsString } from 'class-validator';

import { Match } from '@/common/validation/decorators';
import { CreateUserDto } from '@/user/dto/create-user.dto';

export class RegisterDto extends CreateUserDto {
  @IsString()
  @Match(RegisterDto, 'password', { message: "Passwords don't match!" })
  passwordComparison!: string;
}
