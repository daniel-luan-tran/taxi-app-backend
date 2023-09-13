import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from '../../auth/entities/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName?: string | null;

  @IsString()
  lastName?: string | null;

  @IsString()
  password?: string | null;

  @IsBoolean()
  active: boolean;

  @IsString()
  azureOid?: string | null;

  @IsString()
  displayName?: string | null;

  @IsString()
  phoneNumber?: string | null;

  @IsString()
  address?: string | null;

  @IsEnum(Role)
  role: Role;
}
