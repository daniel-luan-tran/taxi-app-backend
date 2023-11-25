import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { AzureUsersService } from './azure-users.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AzureAccountsService } from './azure-account.service';
import { AccountEntity } from './entities/account.entity';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('jwtUsers')
@UseGuards(JwtGuard)
export class JwtUsersController {
  constructor(
    private readonly usersService: AzureUsersService,
    private readonly azureAccountService: AzureAccountsService,
  ) {}

  @Get('/')
  public async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get('/check-role')
  public async checkRole(@Req() req) {
    const user = this.usersService.findById(req.user.id);
    return user;
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
    @Body() data: UpdateAccountDto,
  ): Promise<AccountEntity> {
    return this.azureAccountService.update(id, data);
  }
}
