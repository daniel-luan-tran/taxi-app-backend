import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName?: string | null;

  @IsString()
  lastName?: string | null;

  @IsString()
  @IsOptional()
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

  @IsOptional()
  driverTypeId?: number;
}
