import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  id: string;
  accountId: string;
}
