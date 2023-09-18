import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

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
  @IsNotEmpty()
  phoneNumber?: string | null;

  @IsString()
  @IsNotEmpty()
  address?: string | null;

  @IsNotEmpty()
  driverTypeId?: number;
}
