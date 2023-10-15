import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateAccountDto {
  // @IsEmail()
  email: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  @IsOptional()
  azureOid?: string;

  @IsString()
  displayName?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  driverTypeId?: number;
}
