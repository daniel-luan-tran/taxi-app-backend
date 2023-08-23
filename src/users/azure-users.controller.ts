import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { AzureUsersService } from './azure-users.service';

@Controller('azureUsers')
@UseGuards(SessionAuthGuard)
export class AzureUsersController {
  constructor(private readonly usersService: AzureUsersService) {}

  @Get('/')
  public async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get('/:id')
  public async findById(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findById(id);
  }

  @Get('/:id')
  public async findByAzureOid(
    @Param('azureOid') id: string,
  ): Promise<UserEntity> {
    return this.usersService.findById(id);
  }

  @Post('/')
  public async create(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(data);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, data);
  }
}
