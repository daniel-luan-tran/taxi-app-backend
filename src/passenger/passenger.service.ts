import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class PassengerService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getPassenger(): Promise<UserEntity[]> {
    const passengers = await this.prismaService.user.findMany({
      include: { account: true },
    });
    return passengers;
  }
}
