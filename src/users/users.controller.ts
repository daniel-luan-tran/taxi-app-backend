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
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(SessionAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  public async findAll(): Promise<AccountEntity[]> {
    return this.usersService.findAll();
  }

  @Get('/:id')
  public async findById(@Param('id') id: string): Promise<AccountEntity> {
    return this.usersService.findById(id);
  }

  @Post('/')
  public async create(@Body() data: CreateAccountDto): Promise<AccountEntity> {
    return this.usersService.create(data);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateAccountDto,
  ): Promise<AccountEntity> {
    return this.usersService.update(id, data);
  }
}
