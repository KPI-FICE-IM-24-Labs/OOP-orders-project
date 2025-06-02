import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { toUserDto } from '../dto/toUserDto';
import { JwtGuard } from '../guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('search')
  public async getByEmail(@Query('email') email: string) {
    if (!email) {
      throw new ForbiddenException('Email should not be empty');
    }
    const user = await this.service.getUserByEmail(email);
    return toUserDto(user);
  }

  @Get()
  public async getAllUsers() {
    return await this.service.getAllUsers();
  }
}
