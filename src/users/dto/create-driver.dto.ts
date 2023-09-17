import { IsNotEmpty } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  driverTypeId: number;
}
