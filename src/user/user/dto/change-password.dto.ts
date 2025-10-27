// src/user/user.dto.ts
import { IsString } from 'class-validator';

export class ChangePasswordUserDto {

  @IsString()
  readonly current_password: string;

  @IsString()
  readonly new_password: string;

  @IsString()
  readonly re_new_password: string;
}
